import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MessageDto } from './dto/message.dto';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ENV } from '../common/env';
import { SupportRequestDto } from './dto/supportRequest.dto';

@Injectable()
export class ChatbotService {
  constructor(private readonly httpService: HttpService) {}

  private readonly supportUrl = `${ENV.DOTNET_API_URL}/api/chatbot`;

  async sendMessage(message: MessageDto): Promise<MessageDto> {
    const ollamaURL = process.env.OLLAMA_BASE_URL;
    try {
      const response = await firstValueFrom(
        this.httpService.post<{ message: { content: string } }>(
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
      return { message: response.data.message.content };
    } catch {
      throw new InternalServerErrorException(
        'Error in sending message to Ollama',
      );
    }
  }

  // ---- Support queue (proxied to .NET, always with the caller's own token) ----

  async callSupport(token: string): Promise<SupportRequestDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<SupportRequestDto>(
          this.supportUrl,
          null,
          this.authHeaders(token),
        ),
      );
      return response.data;
    } catch (error: unknown) {
      this.handleHttpError(error, 'Failed to call support');
    }
  }

  async getMySupportRequest(token: string): Promise<SupportRequestDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<SupportRequestDto>(
          `${this.supportUrl}/me`,
          this.authHeaders(token),
        ),
      );
      return response.data;
    } catch (error: unknown) {
      this.handleHttpError(error, 'Not waiting for support');
    }
  }

  async getWaiting(token: string): Promise<SupportRequestDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<SupportRequestDto[]>(
          this.supportUrl,
          this.authHeaders(token),
        ),
      );
      return response.data;
    } catch (error: unknown) {
      this.handleHttpError(error, 'Failed to fetch the support queue');
    }
  }

  async closeSupport(conversationId: string, token: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.delete(
          `${this.supportUrl}/${encodeURIComponent(conversationId)}`,
          this.authHeaders(token),
        ),
      );
    } catch (error: unknown) {
      this.handleHttpError(error, 'Support request not found');
    }
  }

  private authHeaders(token: string) {
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  private handleHttpError(error: unknown, fallbackMessage: string): never {
    const axiosError = error as AxiosError<string | { message?: string }>;
    const data = axiosError.response?.data;
    const message =
      (typeof data === 'string' ? data : data?.message) || fallbackMessage;

    switch (axiosError.response?.status) {
      case 400:
        throw new BadRequestException(message);
      case 401:
        throw new UnauthorizedException();
      case 404:
        throw new NotFoundException(message);
      default:
        throw new InternalServerErrorException(fallbackMessage);
    }
  }
}
