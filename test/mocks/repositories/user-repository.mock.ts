import { UserRepository } from '../../../src/infrastructure/repositories/user.repository';

export const createMockUserRepository = () => ({
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByUserName: jest.fn(),
  findByEmailOrUserName: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  validateCredentials: jest.fn(),
});

export type MockUserRepository = jest.Mocked<UserRepository>;
