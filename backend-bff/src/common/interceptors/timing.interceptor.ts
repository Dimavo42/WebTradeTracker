import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import type { Request } from 'express';
/**
 * Interceptor lifecycle:
 *
 * 1. A request comes into the application.
 * 2. After middleware and guards run, Nest calls this `intercept()` method.
 * 3. Code before `next.handle()` runs BEFORE the controller (pre-processing).
 * 4. `next.handle()` triggers the route handler (controller + service logic).
 * 5. The returned Observable allows us to hook into the response stream.
 * 6. Operators like `tap()` run AFTER the controller finishes (post-processing).
 * 7. The final result is sent back to the client.
 *
 * In this interceptor:
 * - We capture the start time before the controller executes.
 * - After the response is ready, we log how long the request took.
 */

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<Request>();
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        console.log(
          `[RES] ${req.method} ${req.originalUrl} - ${Date.now() - start}ms`,
        );
      }),
    );
  }
}
