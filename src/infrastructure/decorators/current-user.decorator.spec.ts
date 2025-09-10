import { ExecutionContext } from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import { UserModel } from '../../domain/models/user.model';
import {
  mockUserModel,
  mockAdminUserModel,
  mockInactiveUserModel,
  mockExecutionContext,
  mockExecutionContextWithoutUser,
  mockExecutionContextWithUndefinedUser,
} from '../../../test/mocks/decorators/current-user-decorator.mock';

describe('CurrentUser Decorator', () => {
  const testCurrentUser = (
    _data: unknown,
    ctx: ExecutionContext,
  ): UserModel => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  };

  describe('Basic Functionality', () => {
    it('should be defined', () => {
      expect(CurrentUser).toBeDefined();
      expect(typeof CurrentUser).toBe('function');
    });

    it('should be a parameter decorator', () => {
      expect(CurrentUser.toString()).toContain('ROUTE_ARGS_METADATA');
    });
  });

  describe('User Extraction', () => {
    it('should extract user from request for regular user', () => {
      const mockCtx = mockExecutionContext(mockUserModel);
      const result = testCurrentUser(undefined, mockCtx);

      expect(result).toBe(mockUserModel);
      expect(result.id).toBe(1);
      expect(result.email).toBe('test@example.com');
      expect(result.userName).toBe('testuser');
      expect(result.name).toBe('Test');
      expect(result.lastName).toBe('User');
      expect(result.idRole).toBe(1);
      expect(result.idStatus).toBe(1);
    });

    it('should extract user from request for admin user', () => {
      const mockCtx = mockExecutionContext(mockAdminUserModel);
      const result = testCurrentUser(undefined, mockCtx);

      expect(result).toBe(mockAdminUserModel);
      expect(result.id).toBe(2);
      expect(result.email).toBe('admin@example.com');
      expect(result.userName).toBe('adminuser');
      expect(result.name).toBe('Admin');
      expect(result.lastName).toBe('User');
      expect(result.idRole).toBe(2);
      expect(result.idStatus).toBe(1);
    });

    it('should extract user from request for inactive user', () => {
      const mockCtx = mockExecutionContext(mockInactiveUserModel);
      const result = testCurrentUser(undefined, mockCtx);

      expect(result).toBe(mockInactiveUserModel);
      expect(result.id).toBe(3);
      expect(result.email).toBe('inactive@example.com');
      expect(result.userName).toBe('inactiveuser');
      expect(result.name).toBe('Inactive');
      expect(result.lastName).toBe('User');
      expect(result.idRole).toBe(1);
      expect(result.idStatus).toBe(0);
    });

    it('should return undefined when no user in request', () => {
      const mockCtx = mockExecutionContextWithoutUser();
      const result = testCurrentUser(undefined, mockCtx);

      expect(result).toBeUndefined();
    });

    it('should return undefined when user is explicitly undefined', () => {
      const mockCtx = mockExecutionContextWithUndefinedUser();
      const result = testCurrentUser(undefined, mockCtx);

      expect(result).toBeUndefined();
    });
  });

  describe('ExecutionContext Integration', () => {
    it('should call switchToHttp on context', () => {
      const mockCtx = mockExecutionContext(mockUserModel);
      const switchToHttpSpy = jest.spyOn(mockCtx, 'switchToHttp');

      testCurrentUser(undefined, mockCtx);

      expect(switchToHttpSpy).toHaveBeenCalledTimes(1);
    });

    it('should call getRequest on HTTP context', () => {
      const mockCtx = mockExecutionContext(mockUserModel);
      const httpContext = mockCtx.switchToHttp();
      const getRequestSpy = jest.spyOn(httpContext, 'getRequest');

      testCurrentUser(undefined, mockCtx);

      expect(getRequestSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle different execution context types', () => {
      const mockCtx = mockExecutionContext(mockUserModel);

      testCurrentUser(undefined, mockCtx);

      expect(mockCtx.getType).toBeDefined();
      expect(typeof mockCtx.getType).toBe('function');
    });
  });

  describe('Data Parameter Handling', () => {
    it('should ignore data parameter for regular user', () => {
      const mockCtx = mockExecutionContext(mockUserModel);
      const result = testCurrentUser('someData', mockCtx);

      expect(result).toBe(mockUserModel);
    });

    it('should ignore data parameter for admin user', () => {
      const mockCtx = mockExecutionContext(mockAdminUserModel);
      const result = testCurrentUser({ role: 'admin' }, mockCtx);

      expect(result).toBe(mockAdminUserModel);
    });

    it('should ignore data parameter when no user', () => {
      const mockCtx = mockExecutionContextWithoutUser();
      const result = testCurrentUser(null, mockCtx);

      expect(result).toBeUndefined();
    });

    it('should handle various data types', () => {
      const mockCtx = mockExecutionContext(mockUserModel);

      expect(testCurrentUser(undefined, mockCtx)).toBe(mockUserModel);
      expect(testCurrentUser(null, mockCtx)).toBe(mockUserModel);
      expect(testCurrentUser('string', mockCtx)).toBe(mockUserModel);
      expect(testCurrentUser(123, mockCtx)).toBe(mockUserModel);
      expect(testCurrentUser({}, mockCtx)).toBe(mockUserModel);
      expect(testCurrentUser([], mockCtx)).toBe(mockUserModel);
    });
  });

  describe('Edge Cases', () => {
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

      const result = testCurrentUser(undefined, mockCtx);

      expect(result).toBeNull();
    });

    it('should handle request with empty object user', () => {
      const request = { user: {} };
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

      const result = testCurrentUser(undefined, mockCtx);

      expect(result).toEqual({});
    });

    it('should handle malformed request object', () => {
      const request = { someOtherProperty: 'value' };
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

      const result = testCurrentUser(undefined, mockCtx);

      expect(result).toBeUndefined();
    });
  });

  describe('Type Safety', () => {
    it('should return UserModel type when user exists', () => {
      const mockCtx = mockExecutionContext(mockUserModel);
      const result = testCurrentUser(undefined, mockCtx);

      expect(result).toBeInstanceOf(Object);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('userName');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('lastName');
      expect(result).toHaveProperty('idRole');
      expect(result).toHaveProperty('idStatus');
      expect(result).toHaveProperty('toPlainObject');
    });

    it('should handle user with toPlainObject method', () => {
      const mockCtx = mockExecutionContext(mockUserModel);
      const result = testCurrentUser(undefined, mockCtx);

      expect(typeof result.toPlainObject).toBe('function');
      expect(result.toPlainObject()).toEqual({
        id: 1,
        email: 'test@example.com',
        userName: 'testuser',
        name: 'Test',
        lastName: 'User',
        idRole: 1,
        idStatus: 1,
      });
    });
  });

  describe('Integration Scenarios', () => {
    it('should work with different user roles', () => {
      const regularUserCtx = mockExecutionContext(mockUserModel);
      const adminUserCtx = mockExecutionContext(mockAdminUserModel);
      const inactiveUserCtx = mockExecutionContext(mockInactiveUserModel);

      expect(testCurrentUser(undefined, regularUserCtx).idRole).toBe(1);
      expect(testCurrentUser(undefined, adminUserCtx).idRole).toBe(2);
      expect(testCurrentUser(undefined, inactiveUserCtx).idRole).toBe(1);
    });

    it('should work with different user statuses', () => {
      const activeUserCtx = mockExecutionContext(mockUserModel);
      const inactiveUserCtx = mockExecutionContext(mockInactiveUserModel);

      expect(testCurrentUser(undefined, activeUserCtx).idStatus).toBe(1);
      expect(testCurrentUser(undefined, inactiveUserCtx).idStatus).toBe(0);
    });

    it('should work with different user emails', () => {
      const regularUserCtx = mockExecutionContext(mockUserModel);
      const adminUserCtx = mockExecutionContext(mockAdminUserModel);
      const inactiveUserCtx = mockExecutionContext(mockInactiveUserModel);

      expect(testCurrentUser(undefined, regularUserCtx).email).toBe(
        'test@example.com',
      );
      expect(testCurrentUser(undefined, adminUserCtx).email).toBe(
        'admin@example.com',
      );
      expect(testCurrentUser(undefined, inactiveUserCtx).email).toBe(
        'inactive@example.com',
      );
    });
  });
});
