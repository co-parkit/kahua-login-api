import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { CODES } from '../../config/general.codes';

/**
 * Interceptor para manejar errores de JWT de forma centralizada
 * Captura errores de tokens expirados e inválidos
 */
@Injectable()
export class JwtErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof TokenExpiredError) {
          throw new UnauthorizedException(CODES.PKL_JWT_EXPIRED);
        }

        if (error instanceof JsonWebTokenError) {
          throw new UnauthorizedException(CODES.PKL_JWT_INVALID);
        }

        return throwError(() => error);
      }),
    );
  }
}
