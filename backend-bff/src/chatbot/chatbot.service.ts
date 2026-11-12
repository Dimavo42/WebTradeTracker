import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MessageDto } from './dto/message.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChatbotService {
  constructor(private readonly httpService: HttpService) {}

  async sendMessage(message: MessageDto): Promise<MessageDto> {
    const ollamaURL = process.env.OLLAMA_BASE_URL;
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${ollamaURL}/api/chat`,
          {
            model: 'llama3.2',
            messages: [
              {
                role: 'user',
                content: message.message,
              },
            ],
            stream: false,
          },
          { timeout: 120_000 },
        ),
      );
      return { message : response.data.message.content};
    } catch (e) {
      throw new InternalServerErrorException(
        'Error in sending message to Ollama',
      );
    }
  }
}
