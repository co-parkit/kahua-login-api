import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler, UnauthorizedException } from '@nestjs/common';
import { JwtErrorInterceptor } from './jwt-error.interceptor';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { of, throwError } from 'rxjs';

describe('JwtErrorInterceptor', () => {
  let interceptor: JwtErrorInterceptor;
  let context: jest.Mocked<ExecutionContext>;
  let callHandler: jest.Mocked<CallHandler>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtErrorInterceptor],
    }).compile();

    interceptor = module.get<JwtErrorInterceptor>(JwtErrorInterceptor);

    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      }),
    } as any;

    callHandler = {
      handle: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  // TODO: Implementar tests
  // - should pass through successful responses
  // - should handle TokenExpiredError correctly
  // - should handle JsonWebTokenError correctly
  // - should throw UnauthorizedException for expired tokens
  // - should throw UnauthorizedException for invalid tokens
  // - should pass through other errors unchanged
  // - should use correct error codes for JWT errors
});
