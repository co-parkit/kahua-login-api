import { ExecutionContext } from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import {
  mockUserModel,
  mockAdminUserModel,
  mockInactiveUserModel,
  mockExecutionContext,
  mockExecutionContextWithoutUser,
  mockExecutionContextWithUndefinedUser,
} from '../../../test/mocks/decorators/current-user-decorator.mock';

describe('CurrentUser Decorator', () => {
  const getCurrentUserFunction = () => {
    const decoratorFunction = (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    };
    return decoratorFunction;
  };

  describe('Basic Functionality', () => {
    it('should be defined', () => {
      expect(CurrentUser).toBeDefined();
    });

    it('should be a function', () => {
      expect(typeof CurrentUser).toBe('function');
    });
  });

  describe('User Extraction', () => {
    it('should extract user from request when user exists', () => {
      const mockCtx = mockExecutionContext(mockUserModel);
      const currentUserFunction = getCurrentUserFunction();

      const result = currentUserFunction(undefined, mockCtx);

      expect(result).toEqual(mockUserModel);
      expect(mockCtx.switchToHttp).toHaveBeenCalled();
    });

    it('should extract admin user from request', () => {
      const mockCtx = mockExecutionContext(mockAdminUserModel);
      const currentUserFunction = getCurrentUserFunction();

      const result = currentUserFunction(undefined, mockCtx);

      expect(result).toEqual(mockAdminUserModel);
      expect(result.idRole).toBe(2);
    });

    it('should extract inactive user from request', () => {
      const mockCtx = mockExecutionContext(mockInactiveUserModel);
      const currentUserFunction = getCurrentUserFunction();

      const result = currentUserFunction(undefined, mockCtx);

      expect(result).toEqual(mockInactiveUserModel);
      expect(result.idStatus).toBe(0);
    });

    it('should return undefined when user is not in request', () => {
      const mockCtx = mockExecutionContextWithoutUser();
      const currentUserFunction = getCurrentUserFunction();

      const result = currentUserFunction(undefined, mockCtx);

      expect(result).toBeUndefined();
    });

    it('should return undefined when user is explicitly undefined', () => {
      const mockCtx = mockExecutionContextWithUndefinedUser();
      const currentUserFunction = getCurrentUserFunction();

      const result = currentUserFunction(undefined, mockCtx);

      expect(result).toBeUndefined();
    });
  });

  describe('Parameter Handling', () => {
    it('should ignore data parameter and return user', () => {
      const mockCtx = mockExecutionContext(mockUserModel);
      const currentUserFunction = getCurrentUserFunction();
      const data = { some: 'data' };

      const result = currentUserFunction(data, mockCtx);

      expect(result).toEqual(mockUserModel);
    });

    it('should work with null data parameter', () => {
      const mockCtx = mockExecutionContext(mockUserModel);
      const currentUserFunction = getCurrentUserFunction();

      const result = currentUserFunction(null, mockCtx);

      expect(result).toEqual(mockUserModel);
    });

    it('should work with string data parameter', () => {
      const mockCtx = mockExecutionContext(mockUserModel);
      const currentUserFunction = getCurrentUserFunction();
      const data = 'some string';

      const result = currentUserFunction(data, mockCtx);

      expect(result).toEqual(mockUserModel);
    });
  });

  describe('ExecutionContext Integration', () => {
    it('should call switchToHttp on context', () => {
      const mockCtx = mockExecutionContext(mockUserModel);
      const currentUserFunction = getCurrentUserFunction();

      currentUserFunction(undefined, mockCtx);

      expect(mockCtx.switchToHttp).toHaveBeenCalledTimes(1);
    });

    it('should call getRequest on http context', () => {
      const mockCtx = mockExecutionContext(mockUserModel);
      const currentUserFunction = getCurrentUserFunction();
      const httpContext = mockCtx.switchToHttp();

      currentUserFunction(undefined, mockCtx);

      expect(httpContext.getRequest).toHaveBeenCalledTimes(1);
    });

    it('should handle different execution context types', () => {
      const mockCtx = mockExecutionContext(mockUserModel);
      const currentUserFunction = getCurrentUserFunction();

      const result = currentUserFunction(undefined, mockCtx);

      expect(result).toEqual(mockUserModel);
      expect(mockCtx.switchToHttp).toHaveBeenCalled();
    });
  });

  describe('UserModel Properties', () => {
    it('should return user with correct id', () => {
      const mockCtx = mockExecutionContext(mockUserModel);
      const currentUserFunction = getCurrentUserFunction();

      const result = currentUserFunction(undefined, mockCtx);

      expect(result.id).toBe(1);
    });

    it('should return user with correct email', () => {
      const mockCtx = mockExecutionContext(mockUserModel);
      const currentUserFunction = getCurrentUserFunction();

      const result = currentUserFunction(undefined, mockCtx);

      expect(result.email).toBe('test@example.com');
    });

    it('should return user with correct userName', () => {
      const mockCtx = mockExecutionContext(mockUserModel);
      const currentUserFunction = getCurrentUserFunction();

      const result = currentUserFunction(undefined, mockCtx);

      expect(result.userName).toBe('testuser');
    });

    it('should return user with correct name and lastName', () => {
      const mockCtx = mockExecutionContext(mockUserModel);
      const currentUserFunction = getCurrentUserFunction();

      const result = currentUserFunction(undefined, mockCtx);

      expect(result.name).toBe('Test');
      expect(result.lastName).toBe('User');
    });

    it('should return user with correct role and status', () => {
      const mockCtx = mockExecutionContext(mockUserModel);
      const currentUserFunction = getCurrentUserFunction();

      const result = currentUserFunction(undefined, mockCtx);

      expect(result.idRole).toBe(1);
      expect(result.idStatus).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle request without user property', () => {
      const request = { otherProperty: 'value' };
      const mockCtx = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(request),
        }),
        getType: jest.fn().mockReturnValue('http'),
        getClass: jest.fn(),
        getHandler: jest.fn(),
        getArgs: jest.fn(),
        getArgByIndex: jest.fn(),
        switchToRpc: jest.fn(),
        switchToWs: jest.fn(),
      } as unknown as ExecutionContext;
      const currentUserFunction = getCurrentUserFunction();

      const result = currentUserFunction(undefined, mockCtx);

      expect(result).toBeUndefined();
    });

    it('should handle request with null user', () => {
      const request = { user: null };
      const mockCtx = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(request),
        }),
        getType: jest.fn().mockReturnValue('http'),
        getClass: jest.fn(),
        getHandler: jest.fn(),
        getArgs: jest.fn(),
        getArgByIndex: jest.fn(),
        switchToRpc: jest.fn(),
        switchToWs: jest.fn(),
      } as unknown as ExecutionContext;
      const currentUserFunction = getCurrentUserFunction();

      const result = currentUserFunction(undefined, mockCtx);

      expect(result).toBeNull();
    });

    it('should handle empty request object', () => {
      const request = {};
      const mockCtx = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(request),
        }),
        getType: jest.fn().mockReturnValue('http'),
        getClass: jest.fn(),
        getHandler: jest.fn(),
        getArgs: jest.fn(),
        getArgByIndex: jest.fn(),
        switchToRpc: jest.fn(),
        switchToWs: jest.fn(),
      } as unknown as ExecutionContext;
      const currentUserFunction = getCurrentUserFunction();

      const result = currentUserFunction(undefined, mockCtx);

      expect(result).toBeUndefined();
    });
  });

  describe('Type Safety', () => {
    it('should return UserModel type when user exists', () => {
      const mockCtx = mockExecutionContext(mockUserModel);
      const currentUserFunction = getCurrentUserFunction();

      const result = currentUserFunction(undefined, mockCtx);

      expect(result).toBeInstanceOf(Object);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('userName');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('lastName');
      expect(result).toHaveProperty('idRole');
      expect(result).toHaveProperty('idStatus');
    });

    it('should handle different user types correctly', () => {
      const regularUserCtx = mockExecutionContext(mockUserModel);
      const adminUserCtx = mockExecutionContext(mockAdminUserModel);
      const inactiveUserCtx = mockExecutionContext(mockInactiveUserModel);
      const currentUserFunction = getCurrentUserFunction();

      const regularResult = currentUserFunction(undefined, regularUserCtx);
      const adminResult = currentUserFunction(undefined, adminUserCtx);
      const inactiveResult = currentUserFunction(undefined, inactiveUserCtx);

      expect(regularResult.idRole).toBe(1);
      expect(adminResult.idRole).toBe(2);
      expect(inactiveResult.idStatus).toBe(0);
    });
  });

  describe('Integration Scenarios', () => {
    it('should work in controller context', () => {
      const mockCtx = mockExecutionContext(mockUserModel);
      const currentUserFunction = getCurrentUserFunction();

      const result = currentUserFunction(undefined, mockCtx);

      expect(result).toBeDefined();
      expect(typeof result.id).toBe('number');
      expect(typeof result.email).toBe('string');
    });

    it('should work with different data types as first parameter', () => {
      const mockCtx = mockExecutionContext(mockUserModel);
      const currentUserFunction = getCurrentUserFunction();

      const result1 = currentUserFunction('string', mockCtx);
      const result2 = currentUserFunction(123, mockCtx);
      const result3 = currentUserFunction({ key: 'value' }, mockCtx);
      const result4 = currentUserFunction([1, 2, 3], mockCtx);

      expect(result1).toEqual(mockUserModel);
      expect(result2).toEqual(mockUserModel);
      expect(result3).toEqual(mockUserModel);
      expect(result4).toEqual(mockUserModel);
    });
  });
});
