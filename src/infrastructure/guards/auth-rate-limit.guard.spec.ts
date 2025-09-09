import { AuthRateLimitGuard } from './auth-rate-limit.guard';
import { ThrottlerException } from '@nestjs/throttler';
import { CODES } from '../../config/general.codes';
import {
  createMockExecutionContext,
  createRequestData,
  TEST_ENDPOINTS,
} from '../../../test/helpers/test-helpers';

describe('AuthRateLimitGuard', () => {
  let guard: AuthRateLimitGuard;

  beforeEach(() => {
    guard = new AuthRateLimitGuard({} as any, {} as any, {} as any);
  });

  describe('Basic Functionality', () => {
    it('should be defined', () => {
      expect(guard).toBeDefined();
    });
  });

  describe('Response Headers', () => {
    it('should set rate limiting headers for login endpoint', async () => {
      const mockContext = createMockExecutionContext(
        createRequestData({ url: '/auth/login' }),
      );
      const response = mockContext.switchToHttp().getResponse();

      await expect(
        guard['throwThrottlingException'](mockContext),
      ).rejects.toThrow(ThrottlerException);

      expect(response.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '5');
      expect(response.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', '0');
      expect(response.setHeader).toHaveBeenCalledWith('Retry-After', '60');
      expect(response.setHeader).toHaveBeenCalledWith(
        'X-RateLimit-Reset',
        expect.any(String),
      );
    });

    it('should set rate limiting headers for forgot-password endpoint', async () => {
      const mockContext = createMockExecutionContext(
        createRequestData({ url: '/auth/forgot-password' }),
      );
      const response = mockContext.switchToHttp().getResponse();

      await expect(
        guard['throwThrottlingException'](mockContext),
      ).rejects.toThrow(ThrottlerException);

      expect(response.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '5');
      expect(response.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', '0');
      expect(response.setHeader).toHaveBeenCalledWith('Retry-After', '300');
      expect(response.setHeader).toHaveBeenCalledWith(
        'X-RateLimit-Reset',
        expect.any(String),
      );
    });

    it('should set rate limiting headers for general endpoints', async () => {
      const mockContext = createMockExecutionContext(
        createRequestData({ url: '/auth/register' }),
      );
      const response = mockContext.switchToHttp().getResponse();

      await expect(
        guard['throwThrottlingException'](mockContext),
      ).rejects.toThrow(ThrottlerException);

      expect(response.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '5');
      expect(response.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', '0');
      expect(response.setHeader).toHaveBeenCalledWith('Retry-After', '1');
      expect(response.setHeader).toHaveBeenCalledWith(
        'X-RateLimit-Reset',
        expect.any(String),
      );
    });
  });

  describe('throwThrottlingException', () => {
    const testRateLimit = async (url: string, expectedMessage: string) => {
      const mockContext = createMockExecutionContext(
        createRequestData({ url }),
      );

      await expect(
        guard['throwThrottlingException'](mockContext),
      ).rejects.toThrow(ThrottlerException);

      await expect(
        guard['throwThrottlingException'](mockContext),
      ).rejects.toThrow(expectedMessage);
    };

    describe('Login Endpoint Rate Limiting', () => {
      const loginUrls = [
        TEST_ENDPOINTS.auth.login,
        '/api/auth/login',
        `${TEST_ENDPOINTS.auth.login}?redirect=/dashboard`,
      ];

      it.each(loginUrls)(
        'should throw login rate limit for URL: %s',
        async (url) => {
          await testRateLimit(url, `${CODES.PKL_RATE_LIMIT_LOGIN.message} Try again in 60 seconds.`);
        },
      );
    });

    describe('Forgot Password Endpoint Rate Limiting', () => {
      const forgotPasswordUrls = [
        TEST_ENDPOINTS.auth.forgotPassword,
        '/api/auth/forgot-password',
        `${TEST_ENDPOINTS.auth.forgotPassword}?email=test@test.com`,
      ];

      it.each(forgotPasswordUrls)(
        'should throw forgot password rate limit for URL: %s',
        async (url) => {
          await testRateLimit(
            url,
            `${CODES.PKL_RATE_LIMIT_FORGOT_PASSWORD.message} Try again in 5 minutes.`,
          );
        },
      );
    });

    describe('General Endpoint Rate Limiting', () => {
      const generalUrls = [
        TEST_ENDPOINTS.auth.register,
        '/parking/pre-enroll',
        '/any/other/endpoint',
        TEST_ENDPOINTS.health,
      ];

      it.each(generalUrls)(
        'should throw general rate limit for URL: %s',
        async (url) => {
          await testRateLimit(url, `${CODES.PKL_RATE_LIMIT_GENERAL.message} Try again in 1 second.`);
        },
      );
    });

    describe('Error Message Validation', () => {
      it('should use correct error messages for each endpoint type', async () => {
        const testCases = [
          {
            url: TEST_ENDPOINTS.auth.login,
            expectedMessage: 'Too many login attempts. Please try again later. Try again in 60 seconds.',
          },
          {
            url: TEST_ENDPOINTS.auth.forgotPassword,
            expectedMessage:
              'Too many password reset requests. Please try again later. Try again in 5 minutes.',
          },
          {
            url: TEST_ENDPOINTS.auth.register,
            expectedMessage: 'Too many requests. Please try again later. Try again in 1 second.',
          },
        ];

        for (const { url, expectedMessage } of testCases) {
          await testRateLimit(url, expectedMessage);
        }
      });
    });

    describe('Case Sensitivity Handling', () => {
      it('should handle case-sensitive URL matching', async () => {
        const testCases = [
          {
            url: '/AUTH/LOGIN',
            expectedMessage: CODES.PKL_RATE_LIMIT_GENERAL.message,
            description: 'uppercase URLs should fallback to general limit',
          },
          {
            url: '/Auth/Forgot-Password',
            expectedMessage: CODES.PKL_RATE_LIMIT_GENERAL.message,
            description: 'mixed case URLs should fallback to general limit',
          },
          {
            url: '/auth/login',
            expectedMessage: CODES.PKL_RATE_LIMIT_LOGIN.message,
            description: 'lowercase URLs should match correctly',
          },
        ];

        for (const { url, expectedMessage } of testCases) {
          await testRateLimit(url, expectedMessage);
        }
      });
    });

    describe('URL Pattern Matching', () => {
      it('should handle comprehensive URL patterns', async () => {
        const testCases = [
          // Login patterns
          {
            url: TEST_ENDPOINTS.auth.login,
            expected: `${CODES.PKL_RATE_LIMIT_LOGIN.message} Try again in 60 seconds.`,
          },
          {
            url: '/api/auth/login',
            expected: `${CODES.PKL_RATE_LIMIT_LOGIN.message} Try again in 60 seconds.`,
          },
          {
            url: '/v1/auth/login',
            expected: `${CODES.PKL_RATE_LIMIT_LOGIN.message} Try again in 60 seconds.`,
          },

          // Forgot password patterns
          {
            url: TEST_ENDPOINTS.auth.forgotPassword,
            expected: `${CODES.PKL_RATE_LIMIT_FORGOT_PASSWORD.message} Try again in 5 minutes.`,
          },
          {
            url: '/api/auth/forgot-password',
            expected: `${CODES.PKL_RATE_LIMIT_FORGOT_PASSWORD.message} Try again in 5 minutes.`,
          },
          {
            url: '/v1/auth/forgot-password',
            expected: `${CODES.PKL_RATE_LIMIT_FORGOT_PASSWORD.message} Try again in 5 minutes.`,
          },

          // General patterns
          {
            url: TEST_ENDPOINTS.auth.register,
            expected: `${CODES.PKL_RATE_LIMIT_GENERAL.message} Try again in 1 second.`,
          },
          {
            url: '/parking/pre-enroll',
            expected: `${CODES.PKL_RATE_LIMIT_GENERAL.message} Try again in 1 second.`,
          },
          {
            url: '/any/other/endpoint',
            expected: `${CODES.PKL_RATE_LIMIT_GENERAL.message} Try again in 1 second.`,
          },
          {
            url: TEST_ENDPOINTS.health,
            expected: `${CODES.PKL_RATE_LIMIT_GENERAL.message} Try again in 1 second.`,
          },
        ];

        for (const { url, expected } of testCases) {
          await testRateLimit(url, expected);
        }
      });
    });

    describe('Edge Cases', () => {
      it('should handle URLs with query parameters correctly', async () => {
        const testCases = [
          {
            url: `${TEST_ENDPOINTS.auth.login}?redirect=/dashboard&token=abc123`,
            expected: CODES.PKL_RATE_LIMIT_LOGIN.message,
          },
          {
            url: `${TEST_ENDPOINTS.auth.forgotPassword}?email=test@test.com&source=web`,
            expected: CODES.PKL_RATE_LIMIT_FORGOT_PASSWORD.message,
          },
          {
            url: `${TEST_ENDPOINTS.auth.register}?invite=xyz789`,
            expected: CODES.PKL_RATE_LIMIT_GENERAL.message,
          },
        ];

        for (const { url, expected } of testCases) {
          await testRateLimit(url, expected);
        }
      });

      it('should handle empty and malformed URLs', async () => {
        const testCases = [
          { url: '', expected: CODES.PKL_RATE_LIMIT_GENERAL.message },
          { url: '/', expected: CODES.PKL_RATE_LIMIT_GENERAL.message },
          { url: '/auth', expected: CODES.PKL_RATE_LIMIT_GENERAL.message },
        ];

        for (const { url, expected } of testCases) {
          await testRateLimit(url, expected);
        }
      });
    });
  });
});
