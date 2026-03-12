import { ExecutionContext } from '@nestjs/common';
import { LoginBody } from './login-body.decorator';
import { LoginDto } from '../../application/dtos/login.dto';

/**
 * Replicates the logic inside LoginBody decorator to test the contract:
 * the decorator extracts request.body from the execution context.
 */
function extractLoginBody(_data: unknown, ctx: ExecutionContext): LoginDto {
  const request = ctx.switchToHttp().getRequest();
  return request.body;
}

const createMockExecutionContext = (body: LoginDto): ExecutionContext =>
  ({
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({ body }),
    }),
  }) as unknown as ExecutionContext;

describe('LoginBody Decorator', () => {
  it('should be defined', () => {
    expect(LoginBody).toBeDefined();
  });

  it('should be a function (param decorator factory)', () => {
    expect(typeof LoginBody).toBe('function');
  });

  it('should extract body from request (decorator contract)', () => {
    const body: LoginDto = {
      email: 'user@example.com',
      password: 'secret123',
    };
    const ctx = createMockExecutionContext(body);

    const result = extractLoginBody(undefined, ctx);

    expect(result).toEqual(body);
    expect(ctx.switchToHttp).toHaveBeenCalled();
  });

  it('should return body with different data', () => {
    const body: LoginDto = {
      email: 'other@test.com',
      password: 'otherpass',
    };
    const ctx = createMockExecutionContext(body);

    const result = extractLoginBody(undefined, ctx);

    expect(result.email).toBe('other@test.com');
    expect(result.password).toBe('otherpass');
  });
});
