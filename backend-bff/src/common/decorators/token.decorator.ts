import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Missing or invalid Authorization header');
    }

    return authHeader.substring(7);
  },
);
