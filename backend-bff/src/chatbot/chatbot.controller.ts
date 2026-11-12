import { Controller, UseGuards, Body, Post } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';
import { ChatbotService } from './chatbot.service';
import type { MessageDto } from './dto/message.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  sendMessageToAIModel(@Body() message: MessageDto): Promise<MessageDto> {
    return this.chatbotService.sendMessage(message);
  }
}
