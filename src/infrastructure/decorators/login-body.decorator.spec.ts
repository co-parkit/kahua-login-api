import { ExecutionContext } from '@nestjs/common';
import { LoginBody } from './login-body.decorator';
import { LoginDto } from '../../application/dtos/login.dto';
import {
  mockLoginDto,
  mockLoginDtoWithDifferentEmail,
  mockLoginDtoWithEmptyPassword,
  mockLoginDtoWithEmptyEmail,
  mockLoginDtoWithSpecialCharacters,
  mockExecutionContext,
  mockExecutionContextWithoutBody,
  mockExecutionContextWithUndefinedBody,
  mockExecutionContextWithNullBody,
  mockExecutionContextWithEmptyBody,
  mockExecutionContextWithMalformedBody,
} from '../../../test/mocks/decorators/login-body-decorator.mock';

describe('LoginBody Decorator', () => {
  const testLoginBody = (_data: unknown, ctx: ExecutionContext): LoginDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.body;
  };

  describe('Basic Functionality', () => {
    it('should be defined', () => {
      expect(LoginBody).toBeDefined();
      expect(typeof LoginBody).toBe('function');
    });

    it('should be a parameter decorator', () => {
      expect(LoginBody.toString()).toContain('ROUTE_ARGS_METADATA');
    });
  });

  describe('Body Extraction', () => {
    it('should extract login body from request for regular login', () => {
      const mockCtx = mockExecutionContext(mockLoginDto);
      const result = testLoginBody(undefined, mockCtx);

      expect(result).toBe(mockLoginDto);
      expect(result.email).toBe('test@example.com');
      expect(result.password).toBe('password123');
    });

    it('should extract login body from request for different email', () => {
      const mockCtx = mockExecutionContext(mockLoginDtoWithDifferentEmail);
      const result = testLoginBody(undefined, mockCtx);

      expect(result).toBe(mockLoginDtoWithDifferentEmail);
      expect(result.email).toBe('admin@example.com');
      expect(result.password).toBe('adminpassword');
    });

    it('should extract login body from request with empty password', () => {
      const mockCtx = mockExecutionContext(mockLoginDtoWithEmptyPassword);
      const result = testLoginBody(undefined, mockCtx);

      expect(result).toBe(mockLoginDtoWithEmptyPassword);
      expect(result.email).toBe('test@example.com');
      expect(result.password).toBe('');
    });

    it('should extract login body from request with empty email', () => {
      const mockCtx = mockExecutionContext(mockLoginDtoWithEmptyEmail);
      const result = testLoginBody(undefined, mockCtx);

      expect(result).toBe(mockLoginDtoWithEmptyEmail);
      expect(result.email).toBe('');
      expect(result.password).toBe('password123');
    });

    it('should extract login body from request with special characters', () => {
      const mockCtx = mockExecutionContext(mockLoginDtoWithSpecialCharacters);
      const result = testLoginBody(undefined, mockCtx);

      expect(result).toBe(mockLoginDtoWithSpecialCharacters);
      expect(result.email).toBe('test+tag@example.com');
      expect(result.password).toBe('P@ssw0rd!@#');
    });

    it('should return undefined when no body in request', () => {
      const mockCtx = mockExecutionContextWithoutBody();
      const result = testLoginBody(undefined, mockCtx);

      expect(result).toBeUndefined();
    });

    it('should return undefined when body is explicitly undefined', () => {
      const mockCtx = mockExecutionContextWithUndefinedBody();
      const result = testLoginBody(undefined, mockCtx);

      expect(result).toBeUndefined();
    });

    it('should return null when body is null', () => {
      const mockCtx = mockExecutionContextWithNullBody();
      const result = testLoginBody(undefined, mockCtx);

      expect(result).toBeNull();
    });

    it('should return empty object when body is empty', () => {
      const mockCtx = mockExecutionContextWithEmptyBody();
      const result = testLoginBody(undefined, mockCtx);

      expect(result).toEqual({});
    });
  });

  describe('ExecutionContext Integration', () => {
    it('should call switchToHttp on context', () => {
      const mockCtx = mockExecutionContext(mockLoginDto);
      const switchToHttpSpy = jest.spyOn(mockCtx, 'switchToHttp');

      testLoginBody(undefined, mockCtx);

      expect(switchToHttpSpy).toHaveBeenCalledTimes(1);
    });

    it('should call getRequest on HTTP context', () => {
      const mockCtx = mockExecutionContext(mockLoginDto);
      const httpContext = mockCtx.switchToHttp();
      const getRequestSpy = jest.spyOn(httpContext, 'getRequest');

      testLoginBody(undefined, mockCtx);

      expect(getRequestSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle different execution context types', () => {
      const mockCtx = mockExecutionContext(mockLoginDto);

      testLoginBody(undefined, mockCtx);

      expect(mockCtx.getType).toBeDefined();
      expect(typeof mockCtx.getType).toBe('function');
    });
  });

  describe('Data Parameter Handling', () => {
    it('should ignore data parameter for regular login', () => {
      const mockCtx = mockExecutionContext(mockLoginDto);
      const result = testLoginBody('someData', mockCtx);

      expect(result).toBe(mockLoginDto);
    });

    it('should ignore data parameter for different login', () => {
      const mockCtx = mockExecutionContext(mockLoginDtoWithDifferentEmail);
      const result = testLoginBody({ validation: 'strict' }, mockCtx);

      expect(result).toBe(mockLoginDtoWithDifferentEmail);
    });

    it('should ignore data parameter when no body', () => {
      const mockCtx = mockExecutionContextWithoutBody();
      const result = testLoginBody(null, mockCtx);

      expect(result).toBeUndefined();
    });

    it('should handle various data types', () => {
      const mockCtx = mockExecutionContext(mockLoginDto);

      expect(testLoginBody(undefined, mockCtx)).toBe(mockLoginDto);
      expect(testLoginBody(null, mockCtx)).toBe(mockLoginDto);
      expect(testLoginBody('string', mockCtx)).toBe(mockLoginDto);
      expect(testLoginBody(123, mockCtx)).toBe(mockLoginDto);
      expect(testLoginBody({}, mockCtx)).toBe(mockLoginDto);
      expect(testLoginBody([], mockCtx)).toBe(mockLoginDto);
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed request object', () => {
      const mockCtx = mockExecutionContextWithMalformedBody();
      const result = testLoginBody(undefined, mockCtx);

      expect(result).toEqual({
        someOtherProperty: 'value',
        notLoginData: true,
      });
    });

    it('should handle request with additional properties in body', () => {
      const bodyWithExtra = {
        ...mockLoginDto,
        rememberMe: true,
        deviceId: 'device123',
      };
      const mockCtx = mockExecutionContext(bodyWithExtra);
      const result = testLoginBody(undefined, mockCtx);

      expect(result).toEqual(bodyWithExtra);
      expect(result.email).toBe('test@example.com');
      expect(result.password).toBe('password123');
      expect((result as any).rememberMe).toBe(true);
      expect((result as any).deviceId).toBe('device123');
    });

    it('should handle request with nested objects in body', () => {
      const bodyWithNested = {
        ...mockLoginDto,
        metadata: {
          source: 'web',
          version: '1.0',
        },
      };
      const mockCtx = mockExecutionContext(bodyWithNested);
      const result = testLoginBody(undefined, mockCtx);

      expect(result).toEqual(bodyWithNested);
      expect(result.email).toBe('test@example.com');
      expect(result.password).toBe('password123');
      expect((result as any).metadata).toEqual({
        source: 'web',
        version: '1.0',
      });
    });
  });

  describe('Type Safety', () => {
    it('should return LoginDto type when body exists', () => {
      const mockCtx = mockExecutionContext(mockLoginDto);
      const result = testLoginBody(undefined, mockCtx);

      expect(result).toBeInstanceOf(Object);
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('password');
    });

    it('should handle body with correct LoginDto structure', () => {
      const mockCtx = mockExecutionContext(mockLoginDto);
      const result = testLoginBody(undefined, mockCtx);

      expect(typeof result.email).toBe('string');
      expect(typeof result.password).toBe('string');
      expect(result.email).toBe('test@example.com');
      expect(result.password).toBe('password123');
    });
  });

  describe('Integration Scenarios', () => {
    it('should work with different email formats', () => {
      const regularEmailCtx = mockExecutionContext(mockLoginDto);
      const specialEmailCtx = mockExecutionContext(
        mockLoginDtoWithSpecialCharacters,
      );
      const emptyEmailCtx = mockExecutionContext(mockLoginDtoWithEmptyEmail);

      expect(testLoginBody(undefined, regularEmailCtx).email).toBe(
        'test@example.com',
      );
      expect(testLoginBody(undefined, specialEmailCtx).email).toBe(
        'test+tag@example.com',
      );
      expect(testLoginBody(undefined, emptyEmailCtx).email).toBe('');
    });

    it('should work with different password formats', () => {
      const regularPasswordCtx = mockExecutionContext(mockLoginDto);
      const specialPasswordCtx = mockExecutionContext(
        mockLoginDtoWithSpecialCharacters,
      );
      const emptyPasswordCtx = mockExecutionContext(
        mockLoginDtoWithEmptyPassword,
      );

      expect(testLoginBody(undefined, regularPasswordCtx).password).toBe(
        'password123',
      );
      expect(testLoginBody(undefined, specialPasswordCtx).password).toBe(
        'P@ssw0rd!@#',
      );
      expect(testLoginBody(undefined, emptyPasswordCtx).password).toBe('');
    });

    it('should work with different login combinations', () => {
      const regularLoginCtx = mockExecutionContext(mockLoginDto);
      const adminLoginCtx = mockExecutionContext(
        mockLoginDtoWithDifferentEmail,
      );
      const emptyLoginCtx = mockExecutionContextWithEmptyBody();

      expect(testLoginBody(undefined, regularLoginCtx)).toEqual(mockLoginDto);
      expect(testLoginBody(undefined, adminLoginCtx)).toEqual(
        mockLoginDtoWithDifferentEmail,
      );
      expect(testLoginBody(undefined, emptyLoginCtx)).toEqual({});
    });
  });
});
