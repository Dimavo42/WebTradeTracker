import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  JwtSocketGuard,
  type SocketAuthData,
} from '../common/guards/jwtSocket.guard';
import { ENV } from '../common/env';
import { ChatbotService } from './chatbot.service';

interface ConversationPayload {
  conversationId: string;
}

interface SupportMessagePayload extends ConversationPayload {
  text: string;
}

// Live support chat. Client connects with: io(`${BFF_URL}/chatbot/support`, { auth: { token } })
//
// Client -> server                      Server -> client
//   support:join    { conversationId }    support:joined   { conversationId }
//   support:message { conversationId,     support:message  { conversationId, text, from, sentAt }
//                     text }              (to everyone in the conversation)
//   support:close   { conversationId }    support:closed   { conversationId }
//                                         support:queue-changed  (to all — refetch GET /api/chatbot)
@WebSocketGateway({
  namespace: '/chatbot/support',
  cors: {
    credentials: true,
    // Same rule as the REST CORS in main.ts
    origin: ENV.MOBILE_ORIGIN === '*' ? true : [ENV.FRONT_URL],
  },
})
@UseGuards(JwtSocketGuard)
export class ChatbotGateway {
  @WebSocketServer()
  private readonly server!: Server;

  constructor(private readonly chatbotService: ChatbotService) {}

  // Join a conversation room — only while it is still waiting in the .NET queue
  @SubscribeMessage('support:join')
  async join(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: ConversationPayload,
  ) {
    const { token } = client.data as SocketAuthData;
    const waiting = await this.chatbotService.getWaiting(token);

    if (!waiting.some((r) => r.conversationId === body?.conversationId)) {
      throw new WsException('Conversation not found');
    }

    await client.join(this.room(body.conversationId));
    return {
      event: 'support:joined',
      data: { conversationId: body.conversationId },
    };
  }

  // Relay a chat message to everyone in the conversation (user + admins)
  @SubscribeMessage('support:message')
  message(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: SupportMessagePayload,
  ) {
    const room = this.room(body?.conversationId);
    const text = typeof body?.text === 'string' ? body.text.trim() : '';

    if (!client.rooms.has(room)) {
      throw new WsException('Join the conversation first');
    }
    if (!text) {
      return;
    }

    const { user } = client.data as SocketAuthData;
    this.server.to(room).emit('support:message', {
      conversationId: body.conversationId,
      text,
      from: user.email,
      sentAt: new Date().toISOString(),
    });
  }

  // Close from inside the chat (user or admin) — removes it from the .NET queue
  @SubscribeMessage('support:close')
  async close(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: ConversationPayload,
  ) {
    const { token } = client.data as SocketAuthData;
    try {
      await this.chatbotService.closeSupport(body?.conversationId, token);
    } catch {
      throw new WsException('Conversation not found');
    }
    this.notifyClosed(body.conversationId);
  }

  // ---- Used by the REST controller too ----

  notifyQueueChanged(): void {
    this.server.emit('support:queue-changed');
  }

  notifyClosed(conversationId: string): void {
    const room = this.room(conversationId);
    this.server.to(room).emit('support:closed', { conversationId });
    this.server.in(room).socketsLeave(room);
    this.notifyQueueChanged();
  }

  private room(conversationId: string): string {
    return `support:${conversationId}`;
  }
}
