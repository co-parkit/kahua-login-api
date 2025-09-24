import { UserModel } from '../../../src/domain/models/user.model';
import {
  LoginDto,
  ForgotPasswordDto,
} from '../../../src/application/dtos/login.dto';
import { CreateUserDto } from '../../../src/application/dtos/register.dto';
import {
  AuthResponseDto,
  UserCreateResponseDto,
} from '../../../src/application/dtos/response.dto';

export const mockUserModel = {
  id: '1',
  email: 'test@example.com',
  user_type: 'employee',
  role_id: 1,
  full_name: 'Test User',
  toPlainObject: jest.fn().mockReturnValue({
    id: '1',
    email: 'test@example.com',
    user_type: 'employee',
    role_id: 1,
    full_name: 'Test User',
  }),
} as unknown as UserModel;

export const mockLoginDto: LoginDto = {
  email: 'test@example.com',
  password: 'password123',
};

export const mockCreateUserDto: CreateUserDto = {
  email: 'newuser@example.com',
  password: 'password123',
  user_type: 'employee',
  role_id: 1,
};

export const mockForgotPasswordDto: ForgotPasswordDto = {
  email: 'test@example.com',
};

export const mockAuthResponse: AuthResponseDto = {
  access_token: 'mock-jwt-token',
  user: {
    id: '1',
    email: 'test@example.com',
    user_type: 'employee',
    role_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
};

export const mockUserCreateResponse: UserCreateResponseDto = {
  userId: '1',
  user: {
    id: '1',
    email: 'newuser@example.com',
    user_type: 'employee',
    role_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
};

export const mockForgotPasswordResponse = {
  success: true,
  message: 'Password reset email sent successfully',
  data: {
    code: 'PKL_SUCCESS',
    message: 'Password reset email sent successfully',
    toJSON: expect.any(Function),
  },
  timestamp: expect.any(String),
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
