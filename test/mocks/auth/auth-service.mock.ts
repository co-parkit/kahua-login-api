import { AuthService } from '../../../src/application/services/auth.service';

export const createMockAuthService = () => ({
  validateUser: jest.fn(),
  generateJWT: jest.fn(),
});

export type MockAuthService = jest.Mocked<AuthService>;
