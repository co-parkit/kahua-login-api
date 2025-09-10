import { UserModel } from '../../../src/domain/models/user.model';
import { LoginDto, ForgotPasswordDto } from '../../../src/application/dtos/login.dto';
import { CreateUserDto } from '../../../src/application/dtos/register.dto';
import { AuthResponseDto, UserCreateResponseDto } from '../../../src/application/dtos/response.dto';

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

export const mockLoginDto: LoginDto = {
  email: 'test@example.com',
  password: 'password123',
};

export const mockCreateUserDto: CreateUserDto = {
  email: 'newuser@example.com',
  password: 'password123',
  name: 'New',
  lastName: 'User',
  userName: 'newuser',
  phone: '1234567890',
  idRole: 1,
};

export const mockForgotPasswordDto: ForgotPasswordDto = {
  email: 'test@example.com',
};

export const mockAuthResponse: AuthResponseDto = {
  access_token: 'mock-jwt-token',
  user: {
    id: 1,
    email: 'test@example.com',
    userName: 'testuser',
    name: 'Test',
    lastName: 'User',
    idRole: 1,
    idStatus: 1,
  },
};

export const mockUserCreateResponse: UserCreateResponseDto = {
  userId: 1,
  user: {
    id: 1,
    email: 'newuser@example.com',
    userName: 'newuser',
    name: 'New',
    lastName: 'User',
    idRole: 1,
    idStatus: 1,
  },
};

export const mockForgotPasswordResponse = {
  code: 'PKL_SUCCESS',
  message: 'Password reset email sent successfully',
  toJSON: jest.fn().mockReturnValue({
    code: 'PKL_SUCCESS',
    message: 'Password reset email sent successfully',
  }),
};

export const mockLoginUseCase = {
  execute: jest.fn(),
};

export const mockRegisterUseCase = {
  execute: jest.fn(),
};

export const mockForgotPasswordUseCase = {
  execute: jest.fn(),
};
