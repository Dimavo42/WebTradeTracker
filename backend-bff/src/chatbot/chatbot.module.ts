import { Module } from '@nestjs/common';
import { JwtStrategy } from '../common/guards/jwt.strategy';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { HttpModule } from '@nestjs/axios';
import { ChatbotGateway } from './chatbot.gateway';

@Module({
  imports: [HttpModule],
  controllers: [ChatbotController],
  providers: [ChatbotService, JwtStrategy, ChatbotGateway],
})
export class ChatbotModule {}
