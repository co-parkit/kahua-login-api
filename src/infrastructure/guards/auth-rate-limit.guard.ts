import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { CODES } from '../../config/general.codes';

/**
 * Guard personalizado para rate limiting en endpoints de autenticación
 * Aplica límites más estrictos para login y forgot-password
 */
@Injectable()
export class AuthRateLimitGuard extends ThrottlerGuard {
  protected async throwThrottlingException(
    context: ExecutionContext,
  ): Promise<void> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { url } = request;

    response.setHeader('X-RateLimit-Limit', '5');
    response.setHeader('X-RateLimit-Remaining', '0');
    response.setHeader(
      'X-RateLimit-Reset',
      new Date(Date.now() + 60000).toISOString(),
    );
    response.setHeader('Retry-After', '60');

    if (url.includes('/auth/login')) {
      const exception = new ThrottlerException(
        CODES.PKL_RATE_LIMIT_LOGIN.message,
      );
      exception.message = `${CODES.PKL_RATE_LIMIT_LOGIN.message} Try again in 60 seconds.`;
      throw exception;
    }

    if (url.includes('/auth/forgot-password')) {
      const exception = new ThrottlerException(
        CODES.PKL_RATE_LIMIT_FORGOT_PASSWORD.message,
      );
      exception.message = `${CODES.PKL_RATE_LIMIT_FORGOT_PASSWORD.message} Try again in 5 minutes.`;
      response.setHeader('Retry-After', '300');
      throw exception;
    }

    const exception = new ThrottlerException(
      CODES.PKL_RATE_LIMIT_GENERAL.message,
    );
    exception.message = `${CODES.PKL_RATE_LIMIT_GENERAL.message} Try again in 1 second.`;
    response.setHeader('Retry-After', '1');
    throw exception;
  }
}
