import { Users } from '../../src/modules/database/schema-user.db';

export const mockUser: Partial<Users> = {
  id: 1,
  name: 'Juan',
  last_name: 'Pérez',
  email: 'juan@gmail.com',
  id_role: 1,
  id_status: 1,
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
