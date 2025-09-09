import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CODES } from '../../config/general.codes';

/**
 * Interceptor global para manejo centralizado de errores
 * Captura todos los errores no manejados y los formatea consistentemente
 */
@Injectable()
export class ErrorHandlerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorHandlerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const request = context.switchToHttp().getRequest();
        const { method, url, body } = request;

        this.logger.error(`Error in ${method} ${url}`, {
          error: error.message,
          stack: error.stack,
          body: this.sanitizeBody(body),
          timestamp: new Date().toISOString(),
        });

        if (error.status) {
          return throwError(() => error);
        }

        return throwError(() => ({
          ...CODES.PKL_GENERAL_ERROR,
          message: 'An unexpected error occurred',
          status: 500,
        }));
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sanitized = { ...body };
    if (sanitized.password) {
      sanitized.password = '[REDACTED]';
    }
    if (sanitized.token) {
      sanitized.token = '[REDACTED]';
    }

    return sanitized;
  }
}
