import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserModel } from '../../domain/models/user.model';

/**
 * Decorador personalizado para obtener el usuario actual del request
 * Extrae el usuario autenticado del request después de la validación de Passport
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserModel => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
