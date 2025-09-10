import { UserModel } from '../../../src/domain/models/user.model';
import { ExecutionContext } from '@nestjs/common';

export const mockUserModel = {
  id: 1,
  email: 'test@example.com',
  userName: 'testuser',
  name: 'Test',
  lastName: 'User',
  idRole: 1,
  idStatus: 1,
  toPlainObject: jest.fn().mockReturnValue({
    id: 1,
    email: 'test@example.com',
    userName: 'testuser',
    name: 'Test',
    lastName: 'User',
    idRole: 1,
    idStatus: 1,
  }),
} as unknown as UserModel;

export const mockAdminUserModel = {
  id: 2,
  email: 'admin@example.com',
  userName: 'adminuser',
  name: 'Admin',
  lastName: 'User',
  idRole: 2,
  idStatus: 1,
  toPlainObject: jest.fn().mockReturnValue({
    id: 2,
    email: 'admin@example.com',
    userName: 'adminuser',
    name: 'Admin',
    lastName: 'User',
    idRole: 2,
    idStatus: 1,
  }),
} as unknown as UserModel;

export const mockInactiveUserModel = {
  id: 3,
  email: 'inactive@example.com',
  userName: 'inactiveuser',
  name: 'Inactive',
  lastName: 'User',
  idRole: 1,
  idStatus: 0,
  toPlainObject: jest.fn().mockReturnValue({
    id: 3,
    email: 'inactive@example.com',
    userName: 'inactiveuser',
    name: 'Inactive',
    lastName: 'User',
    idRole: 1,
    idStatus: 0,
  }),
} as unknown as UserModel;

export const mockExecutionContext = (user: UserModel | null = mockUserModel): ExecutionContext => {
  const request = {
    user,
  };

  return {
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
};

export const mockExecutionContextWithoutUser = (): ExecutionContext => {
  const request = {};

  return {
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
};

export const mockExecutionContextWithUndefinedUser = (): ExecutionContext => {
  const request = {
    user: undefined,
  };

  return {
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
};
