import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtErrorInterceptor } from './jwt-error.interceptor';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { CODES } from '../../config/general.codes';
import {
  mockExecutionContext,
  mockCallHandlerWithSuccess,
  mockCallHandlerWithTokenExpiredError,
  mockCallHandlerWithJsonWebTokenError,
  mockCallHandlerWithGenericError,
  mockCallHandlerWithCustomError,
  mockCustomError,
  mockNetworkError,
  mockValidationError,
} from '../../../test/mocks/interceptors/jwt-error-interceptor.mock';

describe('JwtErrorInterceptor', () => {
  let interceptor: JwtErrorInterceptor;
  let mockCtx: ExecutionContext;

  beforeEach(() => {
    interceptor = new JwtErrorInterceptor();
    mockCtx = mockExecutionContext();
  });

  describe('Basic Functionality', () => {
    it('should be defined', () => {
      expect(interceptor).toBeDefined();
      expect(interceptor).toBeInstanceOf(JwtErrorInterceptor);
    });

    it('should implement NestInterceptor', () => {
      expect(interceptor.intercept).toBeDefined();
      expect(typeof interceptor.intercept).toBe('function');
    });
  });

  describe('Success Cases', () => {
    it('should pass through successful responses', (done) => {
      const successHandler = mockCallHandlerWithSuccess();
      const result = interceptor.intercept(mockCtx, successHandler);

      result.subscribe({
        next: (value) => {
          expect(value).toEqual({ success: true });
          done();
        },
        error: (error) => {
          done(error);
        },
      });
    });

    it('should not modify successful responses', (done) => {
      const successHandler = mockCallHandlerWithSuccess();
      const result = interceptor.intercept(mockCtx, successHandler);

      result.subscribe({
        next: (value) => {
          expect(value).toEqual({ success: true });
          expect(successHandler.handle).toHaveBeenCalledTimes(1);
          done();
        },
        error: (error) => {
          done(error);
        },
      });
    });
  });

  describe('JWT Error Handling', () => {
    it('should handle TokenExpiredError and throw UnauthorizedException with PKL_JWT_EXPIRED', (done) => {
      const expiredHandler = mockCallHandlerWithTokenExpiredError();
      const result = interceptor.intercept(mockCtx, expiredHandler);

      result.subscribe({
        next: () => {
          done(new Error('Expected error but got success'));
        },
        error: (error) => {
          expect(error).toBeInstanceOf(UnauthorizedException);
          expect(error.message).toBe(CODES.PKL_JWT_EXPIRED.message);
          expect(error.getStatus()).toBe(CODES.PKL_JWT_EXPIRED.status);
          done();
        },
      });
    });

    it('should handle JsonWebTokenError and throw UnauthorizedException with PKL_JWT_INVALID', (done) => {
      const invalidHandler = mockCallHandlerWithJsonWebTokenError();
      const result = interceptor.intercept(mockCtx, invalidHandler);

      result.subscribe({
        next: () => {
          done(new Error('Expected error but got success'));
        },
        error: (error) => {
          expect(error).toBeInstanceOf(UnauthorizedException);
          expect(error.message).toBe(CODES.PKL_JWT_INVALID.message);
          expect(error.getStatus()).toBe(CODES.PKL_JWT_INVALID.status);
          done();
        },
      });
    });

    it('should handle TokenExpiredError with custom message', (done) => {
      const customExpiredError = new TokenExpiredError(
        'Custom expired message',
        new Date(),
      );
      const customHandler = mockCallHandlerWithCustomError(customExpiredError);
      const result = interceptor.intercept(mockCtx, customHandler);

      result.subscribe({
        next: () => {
          done(new Error('Expected error but got success'));
        },
        error: (error) => {
          expect(error).toBeInstanceOf(UnauthorizedException);
          expect(error.message).toBe(CODES.PKL_JWT_EXPIRED.message);
          expect(error.getStatus()).toBe(CODES.PKL_JWT_EXPIRED.status);
          done();
        },
      });
    });

    it('should handle JsonWebTokenError with custom message', (done) => {
      const customInvalidError = new JsonWebTokenError(
        'Custom invalid message',
      );
      const customHandler = mockCallHandlerWithCustomError(customInvalidError);
      const result = interceptor.intercept(mockCtx, customHandler);

      result.subscribe({
        next: () => {
          done(new Error('Expected error but got success'));
        },
        error: (error) => {
          expect(error).toBeInstanceOf(UnauthorizedException);
          expect(error.message).toBe(CODES.PKL_JWT_INVALID.message);
          expect(error.getStatus()).toBe(CODES.PKL_JWT_INVALID.status);
          done();
        },
      });
    });
  });

  describe('Non-JWT Error Handling', () => {
    it('should pass through generic errors unchanged', (done) => {
      const genericHandler = mockCallHandlerWithGenericError();
      const result = interceptor.intercept(mockCtx, genericHandler);

      result.subscribe({
        next: () => {
          done(new Error('Expected error but got success'));
        },
        error: (error) => {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('Generic error');
          expect(error).not.toBeInstanceOf(UnauthorizedException);
          done();
        },
      });
    });

    it('should pass through custom errors unchanged', (done) => {
      const customHandler = mockCallHandlerWithCustomError(mockCustomError);
      const result = interceptor.intercept(mockCtx, customHandler);

      result.subscribe({
        next: () => {
          done(new Error('Expected error but got success'));
        },
        error: (error) => {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('Custom error');
          expect(error).not.toBeInstanceOf(UnauthorizedException);
          done();
        },
      });
    });

    it('should pass through network errors unchanged', (done) => {
      const networkHandler = mockCallHandlerWithCustomError(mockNetworkError);
      const result = interceptor.intercept(mockCtx, networkHandler);

      result.subscribe({
        next: () => {
          done(new Error('Expected error but got success'));
        },
        error: (error) => {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('Network error');
          expect(error).not.toBeInstanceOf(UnauthorizedException);
          done();
        },
      });
    });

    it('should pass through validation errors unchanged', (done) => {
      const validationHandler =
        mockCallHandlerWithCustomError(mockValidationError);
      const result = interceptor.intercept(mockCtx, validationHandler);

      result.subscribe({
        next: () => {
          done(new Error('Expected error but got success'));
        },
        error: (error) => {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('Validation error');
          expect(error).not.toBeInstanceOf(UnauthorizedException);
          done();
        },
      });
    });
  });

  describe('Error Type Detection', () => {
    it('should correctly identify TokenExpiredError instances', () => {
      const expiredError = new TokenExpiredError('jwt expired', new Date());
      expect(expiredError instanceof TokenExpiredError).toBe(true);
      expect(expiredError instanceof JsonWebTokenError).toBe(true); // TokenExpiredError extends JsonWebTokenError
    });

    it('should correctly identify JsonWebTokenError instances', () => {
      const invalidError = new JsonWebTokenError('jwt malformed');
      expect(invalidError instanceof JsonWebTokenError).toBe(true);
      expect(invalidError instanceof TokenExpiredError).toBe(false);
    });

    it('should correctly identify generic Error instances', () => {
      const genericError = new Error('Generic error');
      expect(genericError instanceof Error).toBe(true);
      expect(genericError instanceof TokenExpiredError).toBe(false);
      expect(genericError instanceof JsonWebTokenError).toBe(false);
    });
  });

  describe('Error Message Preservation', () => {
    it('should preserve original error message for non-JWT errors', (done) => {
      const originalMessage = 'Original error message';
      const originalError = new Error(originalMessage);
      const customHandler = mockCallHandlerWithCustomError(originalError);
      const result = interceptor.intercept(mockCtx, customHandler);

      result.subscribe({
        next: () => {
          done(new Error('Expected error but got success'));
        },
        error: (error) => {
          expect(error.message).toBe(originalMessage);
          done();
        },
      });
    });

    it('should use predefined messages for JWT errors', (done) => {
      const expiredHandler = mockCallHandlerWithTokenExpiredError();
      const result = interceptor.intercept(mockCtx, expiredHandler);

      result.subscribe({
        next: () => {
          done(new Error('Expected error but got success'));
        },
        error: (error) => {
          expect(error.message).toBe(CODES.PKL_JWT_EXPIRED.message);
          expect(error.message).not.toBe('jwt expired');
          done();
        },
      });
    });
  });

  describe('Error Status Codes', () => {
    it('should set correct status code for TokenExpiredError', (done) => {
      const expiredHandler = mockCallHandlerWithTokenExpiredError();
      const result = interceptor.intercept(mockCtx, expiredHandler);

      result.subscribe({
        next: () => {
          done(new Error('Expected error but got success'));
        },
        error: (error) => {
          expect(error.getStatus()).toBe(CODES.PKL_JWT_EXPIRED.status);
          expect(error.getStatus()).toBe(401);
          done();
        },
      });
    });

    it('should set correct status code for JsonWebTokenError', (done) => {
      const invalidHandler = mockCallHandlerWithJsonWebTokenError();
      const result = interceptor.intercept(mockCtx, invalidHandler);

      result.subscribe({
        next: () => {
          done(new Error('Expected error but got success'));
        },
        error: (error) => {
          expect(error.getStatus()).toBe(CODES.PKL_JWT_INVALID.status);
          expect(error.getStatus()).toBe(401);
          done();
        },
      });
    });
  });

  describe('Error Context', () => {
    it('should call handler.handle with correct context', () => {
      const successHandler = mockCallHandlerWithSuccess();
      interceptor.intercept(mockCtx, successHandler);

      expect(successHandler.handle).toHaveBeenCalledTimes(1);
      expect(successHandler.handle).toHaveBeenCalledWith();
    });

    it('should pass through execution context to handler', () => {
      const successHandler = mockCallHandlerWithSuccess();
      interceptor.intercept(mockCtx, successHandler);

      expect(successHandler.handle).toHaveBeenCalledWith();
    });
  });

  describe('Error Propagation', () => {
    it('should propagate errors through the chain', (done) => {
      const genericHandler = mockCallHandlerWithGenericError();
      const result = interceptor.intercept(mockCtx, genericHandler);

      result.subscribe({
        next: () => {
          done(new Error('Expected error but got success'));
        },
        error: (error) => {
          expect(error).toBeDefined();
          expect(error.message).toBe('Generic error');
          done();
        },
      });
    });

    it('should not swallow errors', (done) => {
      const customHandler = mockCallHandlerWithCustomError(mockCustomError);
      const result = interceptor.intercept(mockCtx, customHandler);

      result.subscribe({
        next: () => {
          done(new Error('Expected error but got success'));
        },
        error: (error) => {
          expect(error).toBeDefined();
          done();
        },
      });
    });
  });

  describe('Error Transformation', () => {
    it('should transform JWT errors to UnauthorizedException', (done) => {
      const expiredHandler = mockCallHandlerWithTokenExpiredError();
      const result = interceptor.intercept(mockCtx, expiredHandler);

      result.subscribe({
        next: () => {
          done(new Error('Expected error but got success'));
        },
        error: (error) => {
          expect(error).toBeInstanceOf(UnauthorizedException);
          expect(error).not.toBeInstanceOf(TokenExpiredError);
          done();
        },
      });
    });

    it('should not transform non-JWT errors', (done) => {
      const genericHandler = mockCallHandlerWithGenericError();
      const result = interceptor.intercept(mockCtx, genericHandler);

      result.subscribe({
        next: () => {
          done(new Error('Expected error but got success'));
        },
        error: (error) => {
          expect(error).toBeInstanceOf(Error);
          expect(error).not.toBeInstanceOf(UnauthorizedException);
          done();
        },
      });
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle null errors', (done) => {
      const nullHandler = mockCallHandlerWithCustomError(null as any);
      const result = interceptor.intercept(mockCtx, nullHandler);

      result.subscribe({
        next: () => {
          done(new Error('Expected error but got success'));
        },
        error: (error) => {
          expect(error).toBeNull();
          done();
        },
      });
    });

    it('should handle undefined errors', (done) => {
      const undefinedHandler = mockCallHandlerWithCustomError(undefined as any);
      const result = interceptor.intercept(mockCtx, undefinedHandler);

      result.subscribe({
        next: () => {
          done(new Error('Expected error but got success'));
        },
        error: (error) => {
          expect(error).toBeUndefined();
          done();
        },
      });
    });

    it('should handle string errors', (done) => {
      const stringHandler = mockCallHandlerWithCustomError(
        'String error' as any,
      );
      const result = interceptor.intercept(mockCtx, stringHandler);

      result.subscribe({
        next: () => {
          done(new Error('Expected error but got success'));
        },
        error: (error) => {
          expect(error).toBe('String error');
          done();
        },
      });
    });

    it('should handle number errors', (done) => {
      const numberHandler = mockCallHandlerWithCustomError(123 as any);
      const result = interceptor.intercept(mockCtx, numberHandler);

      result.subscribe({
        next: () => {
          done(new Error('Expected error but got success'));
        },
        error: (error) => {
          expect(error).toBe(123);
          done();
        },
      });
    });

    it('should handle object errors', (done) => {
      const objectError = { message: 'Object error', code: 500 };
      const objectHandler = mockCallHandlerWithCustomError(objectError as any);
      const result = interceptor.intercept(mockCtx, objectHandler);

      result.subscribe({
        next: () => {
          done(new Error('Expected error but got success'));
        },
        error: (error) => {
          expect(error).toEqual(objectError);
          done();
        },
      });
    });
  });
});
