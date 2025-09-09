import { mockUser } from '../user/login-user.mock';

export const mockJwtResponse = {
  access_token: 'mock-jwt-token',
  user: mockUser.toPlainObject(),
};
