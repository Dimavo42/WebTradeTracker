import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtSocketGuard } from 'src/common/guards/jwtSocket.guard';

@WebSocketGateway({
  namespace: '/chatbot/support',
  cors: {
    credentials: true,
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})
@UseGuards(JwtSocketGuard)
export class ChatGateway {
  @SubscribeMessage('chat-message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: { id: string; text: string },
  ) {
    console.log('Received:', message.text);

    client.emit('chat:reply', `Server received: ${message.text}`);
  }
}
