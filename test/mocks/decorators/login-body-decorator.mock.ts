import { LoginDto } from '../../../src/application/dtos/login.dto';
import { ExecutionContext } from '@nestjs/common';

export const mockLoginDto: LoginDto = {
  email: 'test@example.com',
  password: 'password123',
};

export const mockLoginDtoWithDifferentEmail: LoginDto = {
  email: 'admin@example.com',
  password: 'adminpassword',
};

export const mockLoginDtoWithEmptyPassword: LoginDto = {
  email: 'test@example.com',
  password: '',
};

export const mockLoginDtoWithEmptyEmail: LoginDto = {
  email: '',
  password: 'password123',
};

export const mockLoginDtoWithSpecialCharacters: LoginDto = {
  email: 'test+tag@example.com',
  password: 'P@ssw0rd!@#',
};

export const mockExecutionContext = (body: LoginDto | any = mockLoginDto): ExecutionContext => {
  const request = {
    body,
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

export const mockExecutionContextWithoutBody = (): ExecutionContext => {
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

export const mockExecutionContextWithUndefinedBody = (): ExecutionContext => {
  const request = {
    body: undefined,
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

export const mockExecutionContextWithNullBody = (): ExecutionContext => {
  const request = {
    body: null,
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

export const mockExecutionContextWithEmptyBody = (): ExecutionContext => {
  const request = {
    body: {},
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

export const mockExecutionContextWithMalformedBody = (): ExecutionContext => {
  const request = {
    body: {
      someOtherProperty: 'value',
      notLoginData: true,
    },
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
