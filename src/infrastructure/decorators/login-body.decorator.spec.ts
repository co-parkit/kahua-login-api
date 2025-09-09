import { ExecutionContext } from '@nestjs/common';
import { LoginBody } from './login-body.decorator';
import { LoginDto } from '../../application/dtos/login.dto';

describe('LoginBody Decorator', () => {
  let context: jest.Mocked<ExecutionContext>;

  beforeEach(() => {
    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          body: {
            email: 'test@test.com',
            password: 'password123',
          },
        }),
      }),
    } as any;
  });

  it('should be defined', () => {
    expect(LoginBody).toBeDefined();
  });

  // TODO: Implementar tests
  // - should extract body from request
  // - should return login data when present
  // - should handle missing body in request
  // - should work with different execution contexts
});
