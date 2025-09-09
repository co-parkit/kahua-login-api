import { of, throwError } from 'rxjs';

/**
 * Test Helpers para Interceptors y Guards
 * Proporciona utilidades reutilizables para testing
 */

export interface MockRequestData {
  method?: string;
  url?: string;
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  query?: Record<string, string>;
}

export interface TestError {
  message: string;
  status?: number;
  stack?: string;
}

export const createMockExecutionContext = (
  requestData: MockRequestData = {},
) => {
  const defaultRequest = {
    method: 'POST',
    url: '/test',
    body: {},
    headers: {},
    params: {},
    query: {},
    ...requestData,
  };

  return {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(defaultRequest),
      getResponse: jest.fn().mockReturnValue({
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
      }),
      getNext: jest.fn(),
    }),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getType: jest.fn().mockReturnValue('http'),
    getClass: jest.fn(),
    getHandler: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    getExecutionContext: jest.fn(),
  } as any;
};

export const createMockCallHandler = (
  returnValue: any = of({ success: true }),
) =>
  ({
    handle: jest.fn().mockReturnValue(returnValue),
  } as any);

export const createRequestData = (
  overrides: Partial<MockRequestData> = {},
): MockRequestData => ({
  method: 'POST',
  url: '/auth/login',
  body: { email: 'test@test.com', password: 'password123' },
  headers: { 'content-type': 'application/json' },
  params: {},
  query: {},
  ...overrides,
});

export const createTestError = (
  type: 'http' | 'unhandled' | 'custom',
  options: Partial<TestError> = {},
): any => {
  const baseError = {
    message: 'Test error',
    stack: 'Error: Test error\n    at test',
    ...options,
  };

  switch (type) {
    case 'http':
      return {
        ...baseError,
        status: 400,
        response: baseError.message,
      };
    case 'unhandled':
      return new Error(baseError.message);
    case 'custom':
      return baseError;
    default:
      return baseError;
  }
};

export const createSensitiveBodyData = (
  overrides: Record<string, any> = {},
) => ({
  email: 'test@test.com',
  password: 'secretpassword',
  token: 'jwt-token-here',
  refreshToken: 'refresh-token-here',
  apiKey: 'api-key-here',
  otherData: 'safe data',
  ...overrides,
});

export const HTTP_METHODS = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'HEAD',
  'OPTIONS',
] as const;

export const TEST_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  users: {
    list: '/users',
    create: '/users',
    update: '/users/123',
    delete: '/users/123',
  },
  health: '/health',
  api: '/api/v1/test',
} as const;

export const createErrorObservable = (error: any) => throwError(() => error);

export const createSuccessObservable = (data: any = { success: true }) =>
  of(data);

export const expectSpyToHaveBeenCalledWithError = (
  spy: jest.SpyInstance,
  expectedMessage: string,
  expectedContext: any,
) => {
  expect(spy).toHaveBeenCalledWith(
    expectedMessage,
    expect.objectContaining(expectedContext),
  );
};

export const createTestScenarios = {
  successfulRequest: () => ({
    request: createRequestData(),
    handler: createMockCallHandler(createSuccessObservable()),
    expectedResult: { success: true },
  }),

  httpError: (message = 'Bad Request') => ({
    request: createRequestData(),
    handler: createMockCallHandler(
      createErrorObservable(createTestError('http', { message })),
    ),
    expectedError: { status, message },
  }),

  unhandledError: (message = 'Database connection failed') => ({
    request: createRequestData(),
    handler: createMockCallHandler(
      createErrorObservable(createTestError('unhandled', { message })),
    ),
    expectedError: { status: 500, message: 'An unexpected error occurred' },
  }),

  sensitiveDataRequest: () => ({
    request: createRequestData({ body: createSensitiveBodyData() }),
    handler: createMockCallHandler(
      createErrorObservable(createTestError('unhandled')),
    ),
    expectedSanitizedBody: {
      email: 'test@test.com',
      password: '[REDACTED]',
      token: '[REDACTED]',
      refreshToken: 'refresh-token-here',
      apiKey: 'api-key-here',
      otherData: 'safe data',
    },
  }),
};

export const cleanupMocks = (...mocks: jest.MockedFunction<any>[]) => {
  mocks.forEach((mock) => {
    if (mock && typeof mock.mockClear === 'function') {
      mock.mockClear();
    }
  });
};

export const createTestCase = <T>(
  description: string,
  arrange: () => T,
  act: (arranged: T) => any,
  assert: (result: any, arranged: T) => void,
) => {
  it(description, () => {
    // Arrange
    const arranged = arrange();

    // Act
    const result = act(arranged);

    // Assert
    assert(result, arranged);
  });
};
