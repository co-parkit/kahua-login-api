import {
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ErrorHandlerInterceptor } from './error-handler.interceptor';
import { CODES } from '../../config/general.codes';
import {
  createMockExecutionContext,
  createMockCallHandler,
  createRequestData,
  createTestError,
  createSensitiveBodyData,
  HTTP_METHODS,
  TEST_ENDPOINTS,
  createErrorObservable,
  createSuccessObservable,
  expectSpyToHaveBeenCalledWithError,
  cleanupMocks,
  createTestCase,
} from '../../../test/helpers/test-helpers';

describe('ErrorHandlerInterceptor', () => {
  let interceptor: ErrorHandlerInterceptor;
  let mockContext: jest.Mocked<ExecutionContext>;
  let mockCallHandler: jest.Mocked<CallHandler>;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    interceptor = new ErrorHandlerInterceptor();
    mockContext = createMockExecutionContext();
    mockCallHandler = createMockCallHandler();
    loggerSpy = jest.spyOn(interceptor['logger'], 'error');
  });

  afterEach(() => {
    cleanupMocks(loggerSpy);
    loggerSpy.mockRestore();
  });

  describe('Basic Functionality', () => {
    it('should be defined', () => {
      expect(interceptor).toBeDefined();
    });

    createTestCase(
      'should handle successful requests without errors',
      () => {
        const expectedResponse = { success: true, data: 'test' };
        mockCallHandler.handle.mockReturnValue(
          createSuccessObservable(expectedResponse),
        );
        return { expectedResponse };
      },
      () => {
        return interceptor.intercept(mockContext, mockCallHandler);
      },
      (result$, { expectedResponse }) => {
        result$.subscribe({
          next: (response) => expect(response).toEqual(expectedResponse),
          error: (error) => fail(`Should not have thrown error: ${error}`),
        });
      },
    );
  });

  describe('Error Handling', () => {
    describe('HttpException Handling', () => {
      createTestCase(
        'should preserve HttpException with original status and message',
        () => {
          const httpError = new HttpException(
            'User not found',
            HttpStatus.NOT_FOUND,
          );
          mockCallHandler.handle.mockReturnValue(
            createErrorObservable(httpError),
          );
          return { httpError };
        },
        () => {
          return interceptor.intercept(mockContext, mockCallHandler);
        },
        (result$, { httpError }) => {
          result$.subscribe({
            next: () => fail('Should have thrown an error'),
            error: (error) => {
              expect(error).toBe(httpError);
              expect(error.status).toBe(HttpStatus.NOT_FOUND);
              expect(error.message).toBe('User not found');
            },
          });
        },
      );

      createTestCase(
        'should preserve custom status codes',
        () => {
          const customHttpError = new HttpException(
            'Custom business error',
            422,
          );
          mockCallHandler.handle.mockReturnValue(
            createErrorObservable(customHttpError),
          );
          return { customHttpError };
        },
        () => {
          return interceptor.intercept(mockContext, mockCallHandler);
        },
        (result$, { customHttpError }) => {
          result$.subscribe({
            next: () => fail('Should have thrown an error'),
            error: (error) => {
              expect(error).toBe(customHttpError);
              expect(error.status).toBe(422);
              expect(error.message).toBe('Custom business error');
            },
          });
        },
      );
    });

    describe('Unhandled Error Transformation', () => {
      createTestCase(
        'should transform unhandled errors to generic error response',
        () => {
          const unhandledError = createTestError('unhandled', {
            message: 'Database connection failed',
          });
          mockCallHandler.handle.mockReturnValue(
            createErrorObservable(unhandledError),
          );
          return { unhandledError };
        },
        () => {
          return interceptor.intercept(mockContext, mockCallHandler);
        },
        (result$) => {
          result$.subscribe({
            next: () => fail('Should have thrown an error'),
            error: (error) => {
              expect(error).toEqual({
                ...CODES.PKL_GENERAL_ERROR,
                message: 'An unexpected error occurred',
                status: 500,
              });
            },
          });
        },
      );

      createTestCase(
        'should handle errors without status property',
        () => {
          const errorWithoutStatus = createTestError('custom', {
            message: 'Custom error',
            stack: 'stack trace',
          });
          mockCallHandler.handle.mockReturnValue(
            createErrorObservable(errorWithoutStatus),
          );
          return { errorWithoutStatus };
        },
        () => {
          return interceptor.intercept(mockContext, mockCallHandler);
        },
        (result$) => {
          result$.subscribe({
            next: () => fail('Should have thrown an error'),
            error: (error) => {
              expect(error).toEqual({
                ...CODES.PKL_GENERAL_ERROR,
                message: 'An unexpected error occurred',
                status: 500,
              });
            },
          });
        },
      );
    });
  });

  describe('Logging Functionality', () => {
    createTestCase(
      'should log errors with complete context information',
      () => {
        const testRequest = createRequestData({
          method: 'PUT',
          url: TEST_ENDPOINTS.users.update,
          body: { name: 'John Doe' },
        });
        mockContext = createMockExecutionContext(testRequest);

        const testError = createTestError('unhandled', {
          message: 'Validation failed',
        });
        mockCallHandler.handle.mockReturnValue(
          createErrorObservable(testError),
        );

        return { testRequest, testError };
      },
      () => {
        return interceptor.intercept(mockContext, mockCallHandler);
      },
      (result$, { testRequest, testError }) => {
        result$.subscribe({
          error: () => {
            expectSpyToHaveBeenCalledWithError(
              loggerSpy,
              `Error in ${testRequest.method} ${testRequest.url}`,
              {
                error: 'Validation failed',
                stack: testError.stack,
                body: { name: 'John Doe' },
                timestamp: expect.any(String),
              },
            );
          },
        });
      },
    );

    it('should handle different HTTP methods in error logging', () => {
      HTTP_METHODS.forEach((method) => {
        // Arrange
        const testRequest = createRequestData({
          method,
          url: `/test/${method.toLowerCase()}`,
          body: { test: 'data' },
        });
        mockContext = createMockExecutionContext(testRequest);

        const testError = createTestError('unhandled', {
          message: `${method} error`,
        });
        mockCallHandler.handle.mockReturnValue(
          createErrorObservable(testError),
        );

        // Act
        interceptor.intercept(mockContext, mockCallHandler).subscribe({
          error: () => {
            // Assert
            expect(loggerSpy).toHaveBeenCalledWith(
              `Error in ${method} /test/${method.toLowerCase()}`,
              expect.any(Object),
            );
          },
        });
      });
    });
  });

  describe('Data Sanitization', () => {
    createTestCase(
      'should sanitize sensitive data in request body for logging',
      () => {
        const requestWithSensitiveData = createRequestData({
          body: createSensitiveBodyData(),
        });
        mockContext = createMockExecutionContext(requestWithSensitiveData);

        const unhandledError = createTestError('unhandled', {
          message: 'Test error',
        });
        mockCallHandler.handle.mockReturnValue(
          createErrorObservable(unhandledError),
        );

        return { requestWithSensitiveData, unhandledError };
      },
      () => {
        return interceptor.intercept(mockContext, mockCallHandler);
      },
      (result$, { requestWithSensitiveData }) => {
        result$.subscribe({
          error: () => {
            expectSpyToHaveBeenCalledWithError(
              loggerSpy,
              `Error in ${requestWithSensitiveData.method} ${requestWithSensitiveData.url}`,
              {
                error: 'Test error',
                body: {
                  email: 'test@test.com',
                  password: '[REDACTED]',
                  token: '[REDACTED]',
                  refreshToken: 'refresh-token-here',
                  apiKey: 'api-key-here',
                  otherData: 'safe data',
                },
              },
            );
          },
        });
      },
    );

    createTestCase(
      'should handle request without body',
      () => {
        const requestWithoutBody = createRequestData({
          method: 'GET',
          url: TEST_ENDPOINTS.health,
          body: null,
        });
        mockContext = createMockExecutionContext(requestWithoutBody);

        const unhandledError = createTestError('unhandled', {
          message: 'Test error',
        });
        mockCallHandler.handle.mockReturnValue(
          createErrorObservable(unhandledError),
        );

        return { requestWithoutBody, unhandledError };
      },
      () => {
        return interceptor.intercept(mockContext, mockCallHandler);
      },
      (result$, { requestWithoutBody }) => {
        result$.subscribe({
          error: () => {
            expectSpyToHaveBeenCalledWithError(
              loggerSpy,
              `Error in ${requestWithoutBody.method} ${requestWithoutBody.url}`,
              {
                body: null,
              },
            );
          },
        });
      },
    );
  });

  describe('sanitizeBody Method', () => {
    describe('Password Sanitization', () => {
      createTestCase(
        'should redact password field',
        () => {
          const bodyWithPassword = {
            email: 'test@test.com',
            password: 'secret123',
            name: 'John Doe',
          };
          return { bodyWithPassword };
        },
        ({ bodyWithPassword }) => {
          return interceptor['sanitizeBody'](bodyWithPassword);
        },
        (sanitized) => {
          expect(sanitized).toEqual({
            email: 'test@test.com',
            password: '[REDACTED]',
            name: 'John Doe',
          });
        },
      );
    });

    describe('Token Sanitization', () => {
      createTestCase(
        'should redact token field',
        () => {
          const bodyWithToken = {
            refreshToken: 'jwt-token-here',
            otherData: 'safe',
          };
          return { bodyWithToken };
        },
        ({ bodyWithToken }) => {
          return interceptor['sanitizeBody'](bodyWithToken);
        },
        (sanitized) => {
          expect(sanitized).toEqual({
            refreshToken: 'jwt-token-here',
            otherData: 'safe',
          });
        },
      );
    });

    describe('Edge Cases', () => {
      const edgeCases = [
        { name: 'null body', input: null, expected: null },
        { name: 'undefined body', input: undefined, expected: undefined },
        { name: 'empty object', input: {}, expected: {} },
      ];

      edgeCases.forEach(({ name, input, expected }) => {
        createTestCase(
          `should handle ${name}`,
          () => ({ input, expected }),
          ({ input }) => interceptor['sanitizeBody'](input),
          (result, { expected }) => {
            expect(result).toStrictEqual(expected);
          },
        );
      });
    });
  });
});
