import { User } from '../../src/modules/database/schema-user.db';

export const mockUser: Partial<User> = {
  id: 1,
  name: 'Juan',
  lastName: 'Pérez',
  email: 'juan@gmail.com',
  idRole: 1,
  idStatus: 1,
};

export const mockSignInService = {
  generateJWT: jest.fn().mockReturnValue({
    access_token: 'fake-jwt-token',
    user: mockUser,
  }),
  updateData: jest.fn().mockResolvedValue({
    message: 'User updated successfully',
  }),
};
