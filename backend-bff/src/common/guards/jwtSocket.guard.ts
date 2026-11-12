import { ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtSocketGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const client = context.switchToWs().getClient<Socket>();
    const token = client.handshake.auth?.token;
    return {
      headers: {
        authorization:
          typeof token === 'string' ? `Bearer ${token}` : undefined,
      },
    };
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    context: ExecutionContext,
  ): TUser {
    if (err || !user) {
      throw new WsException('Unauthorized');
    }
    const client = context.switchToWs().getClient<Socket>();
    client.data.user = user;
    return user;
  }
}
