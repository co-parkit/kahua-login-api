import { UserModel } from '../../../src/domain/models/user.model';

export const mockUser: jest.Mocked<UserModel> = {
  id: 1,
  email: 'test@test.com',
  name: 'John',
  lastName: 'Doe',
  idRole: 1,
  idStatus: 1,
  toPlainObject: jest.fn().mockReturnValue({
    id: 1,
    email: 'test@test.com',
    name: 'John',
    lastName: 'Doe',
    idRole: 1,
    idStatus: 1,
  }),
  isActive: jest.fn().mockReturnValue(true),
} as unknown as jest.Mocked<UserModel>;

export const mockInactiveUser: jest.Mocked<UserModel> = {
  ...mockUser,
  isActive: jest.fn().mockReturnValue(false),
} as unknown as jest.Mocked<UserModel>;
