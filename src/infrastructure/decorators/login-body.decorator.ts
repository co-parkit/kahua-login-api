import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LoginDto } from '../../application/dtos/login.dto';

export const LoginBody = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): LoginDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.body;
  },
);
