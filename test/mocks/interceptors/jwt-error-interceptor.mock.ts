import { ExecutionContext, CallHandler } from '@nestjs/common';
import { throwError, of } from 'rxjs';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { CODES } from '../../../src/config/general.codes';

export const mockExecutionContext = (): ExecutionContext => {
  return {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({}),
      getResponse: jest.fn().mockReturnValue({}),
    }),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getType: jest.fn().mockReturnValue('http'),
    getClass: jest.fn(),
    getHandler: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
  } as unknown as ExecutionContext;
};

export const mockCallHandler = (): CallHandler => {
  return {
    handle: jest.fn(),
  } as unknown as CallHandler;
};

export const mockCallHandlerWithSuccess = (): CallHandler => {
  return {
    handle: jest.fn().mockReturnValue(of({ success: true })),
  } as unknown as CallHandler;
};

export const mockCallHandlerWithTokenExpiredError = (): CallHandler => {
  return {
    handle: jest
      .fn()
      .mockReturnValue(
        throwError(() => new TokenExpiredError('jwt expired', new Date())),
      ),
  } as unknown as CallHandler;
};

export const mockCallHandlerWithJsonWebTokenError = (): CallHandler => {
  return {
    handle: jest
      .fn()
      .mockReturnValue(
        throwError(() => new JsonWebTokenError('jwt malformed')),
      ),
  } as unknown as CallHandler;
};

export const mockCallHandlerWithGenericError = (): CallHandler => {
  return {
    handle: jest
      .fn()
      .mockReturnValue(throwError(() => new Error('Generic error'))),
  } as unknown as CallHandler;
};

export const mockCallHandlerWithCustomError = (error: Error): CallHandler => {
  return {
    handle: jest.fn().mockReturnValue(throwError(() => error)),
  } as unknown as CallHandler;
};

export const mockTokenExpiredError = new TokenExpiredError(
  'jwt expired',
  new Date(),
);

export const mockJsonWebTokenError = new JsonWebTokenError('jwt malformed');

export const mockGenericError = new Error('Generic error');

export const mockCustomError = new Error('Custom error');

export const mockNetworkError = new Error('Network error');

export const mockValidationError = new Error('Validation error');

export const mockUnauthorizedException = new Error('Unauthorized');

export const mockForbiddenException = new Error('Forbidden');

export const mockNotFoundException = new Error('Not found');

export const mockInternalServerError = new Error('Internal server error');

export const mockBadRequestException = new Error('Bad request');

export const mockConflictException = new Error('Conflict');

export const mockTooManyRequestsException = new Error('Too many requests');

export const mockServiceUnavailableException = new Error('Service unavailable');

export const mockGatewayTimeoutException = new Error('Gateway timeout');

export const mockRequestTimeoutException = new Error('Request timeout');

export const mockPayloadTooLargeException = new Error('Payload too large');

export const mockUnsupportedMediaTypeException = new Error(
  'Unsupported media type',
);

export const mockNotAcceptableException = new Error('Not acceptable');

export const mockMethodNotAllowedException = new Error('Method not allowed');

export const mockLengthRequiredException = new Error('Length required');

export const mockPreconditionFailedException = new Error('Precondition failed');

export const mockRequestEntityTooLargeException = new Error(
  'Request entity too large',
);

export const mockRequestedRangeNotSatisfiableException = new Error(
  'Requested range not satisfiable',
);

export const mockExpectationFailedException = new Error('Expectation failed');

export const mockIAmATeapotException = new Error('I am a teapot');

export const mockMisdirectedRequestException = new Error('Misdirected request');

export const mockUnprocessableEntityException = new Error(
  'Unprocessable entity',
);

export const mockLockedException = new Error('Locked');

export const mockFailedDependencyException = new Error('Failed dependency');

export const mockTooEarlyException = new Error('Too early');

export const mockUpgradeRequiredException = new Error('Upgrade required');

export const mockPreconditionRequiredException = new Error(
  'Precondition required',
);

export const mockTooManyRequestsException2 = new Error('Too many requests');

export const mockRequestHeaderFieldsTooLargeException = new Error(
  'Request header fields too large',
);

export const mockUnavailableForLegalReasonsException = new Error(
  'Unavailable for legal reasons',
);

export const mockInternalServerErrorException = new Error(
  'Internal server error',
);

export const mockNotImplementedException = new Error('Not implemented');

export const mockBadGatewayException = new Error('Bad gateway');

export const mockServiceUnavailableException2 = new Error(
  'Service unavailable',
);

export const mockGatewayTimeoutException2 = new Error('Gateway timeout');

export const mockHttpVersionNotSupportedException = new Error(
  'HTTP version not supported',
);

export const mockVariantAlsoNegotiatesException = new Error(
  'Variant also negotiates',
);

export const mockInsufficientStorageException = new Error(
  'Insufficient storage',
);

export const mockLoopDetectedException = new Error('Loop detected');

export const mockNotExtendedException = new Error('Not extended');

export const mockNetworkAuthenticationRequiredException = new Error(
  'Network authentication required',
);

export const mockExpectedCodes = {
  PKL_JWT_EXPIRED: CODES.PKL_JWT_EXPIRED,
  PKL_JWT_INVALID: CODES.PKL_JWT_INVALID,
};
