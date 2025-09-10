import { UserModel } from '../../../src/domain/models/user.model';

export const mockUserModel = {
  id: 1,
  email: 'test@example.com',
  username: 'testuser',
  name: 'Test',
  lastName: 'User',
  role: 1,
  status: 1,
  toPlainObject: jest.fn().mockReturnValue({
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    name: 'Test',
    lastName: 'User',
    role: 1,
    status: 1,
  }),
} as unknown as UserModel;

export const mockUserModelInactive = {
  id: 2,
  email: 'inactive@example.com',
  username: 'inactiveuser',
  name: 'Inactive',
  lastName: 'User',
  role: 1,
  status: 0,
  toPlainObject: jest.fn().mockReturnValue({
    id: 2,
    email: 'inactive@example.com',
    username: 'inactiveuser',
    name: 'Inactive',
    lastName: 'User',
    role: 1,
    status: 0,
  }),
} as unknown as UserModel;

export const mockAuthService = {
  validateUser: jest.fn(),
};

export const mockCredentials = {
  email: 'test@example.com',
  password: 'password123',
};

export const mockInvalidCredentials = {
  email: 'invalid@example.com',
  password: 'wrongpassword',
};
