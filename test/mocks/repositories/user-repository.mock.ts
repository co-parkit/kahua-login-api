import { UserRepository } from '../../../src/infrastructure/repositories/user.repository';

export const createMockUserRepository = () => ({
  findByEmailOrUserName: jest.fn(),
  create: jest.fn(),
});

export type MockUserRepository = jest.Mocked<UserRepository>;
