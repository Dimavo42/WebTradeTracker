import { ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthGuard } from '@nestjs/passport';
import type { JwtUser } from '../types/jwtUser.type';

// What the guard stores on each authenticated socket (client.data)
export interface SocketAuthData {
  user: JwtUser;
  token: string;
}

// Validates the JWT the client sends in the socket handshake: io(url, { auth: { token } })
@Injectable()
export class JwtSocketGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const client = context.switchToWs().getClient<Socket>();
    const token: unknown = client.handshake.auth?.token;
    return {
      headers: {
        authorization:
          typeof token === 'string' ? `Bearer ${token}` : undefined,
      },
    };
  }

  // Passport calls handleRequest(err, user, info, context, status) —
  // `context` is the 4th argument, so `info` must be declared even though it's unused.
  handleRequest<TUser = JwtUser>(
    err: unknown,
    user: JwtUser | false,
    _info: unknown,
    context: ExecutionContext,
  ): TUser {
    if (err || !user) {
      throw new WsException('Unauthorized');
    }
    const client = context.switchToWs().getClient<Socket>();
    const data = client.data as SocketAuthData;
    data.user = user;
    // Kept so the gateway can call the .NET API on behalf of this user
    data.token = client.handshake.auth.token as string;
    return user as TUser;
  }
}
