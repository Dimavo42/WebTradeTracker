import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwtAuth.guard';
import { Token } from '../common/decorators/token.decorator';
import { ChatbotService } from './chatbot.service';
import { ChatbotGateway } from './chatbot.gateway';
import type { MessageDto } from './dto/message.dto';
import type { SupportRequestDto } from './dto/supportRequest.dto';

// AI chat:        POST   /api/chatbot/message
// Support queue (logged-in users only):
//                 POST   /api/chatbot                   call support (join the queue)
//                 GET    /api/chatbot/me                my waiting request
//                 GET    /api/chatbot                   everyone waiting
//                 DELETE /api/chatbot/:conversationId   close
@Controller('chatbot')
export class ChatbotController {
  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly chatbotGateway: ChatbotGateway,
  ) {}

  @Post('message')
  sendMessageToAIModel(@Body() message: MessageDto): Promise<MessageDto> {
    return this.chatbotService.sendMessage(message);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async callSupport(@Token() token: string): Promise<SupportRequestDto> {
    const request = await this.chatbotService.callSupport(token);
    this.chatbotGateway.notifyQueueChanged();
    return request;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMySupportRequest(@Token() token: string): Promise<SupportRequestDto> {
    return this.chatbotService.getMySupportRequest(token);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getWaiting(@Token() token: string): Promise<SupportRequestDto[]> {
    return this.chatbotService.getWaiting(token);
  }

  @Delete(':conversationId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async closeSupport(
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
    @Token() token: string,
  ): Promise<void> {
    await this.chatbotService.closeSupport(conversationId, token);
    this.chatbotGateway.notifyClosed(conversationId);
  }
}
