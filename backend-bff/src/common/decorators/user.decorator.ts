import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { JwtUser } from 'src/stocks/types/jwtUser.type';

type RequestWithUser = Request & {
  user: JwtUser;
};

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtUser => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
