import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LoginDto } from '../../application/dtos/login.dto';

/**
 * Decorador personalizado para obtener el body del login
 * Extrae los datos de login del request body
 */
export const LoginBody = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): LoginDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.body;
  },
);
