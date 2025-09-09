import { ForgotPasswordUseCase } from './forgot-password.use-case';
import { AuthService } from '../services/auth.service';
import { ForgotPasswordDto } from '../dtos/login.dto';

describe('ForgotPasswordUseCase', () => {
  let useCase: ForgotPasswordUseCase;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      forgotPassword: jest.fn(),
    };

    // NOTE: Using direct instantiation instead of @nestjs/testing due to dependency resolution issues
    // While @nestjs/testing is the recommended approach, it fails with complex dependency injection
    // in this specific case. Direct instantiation provides better control and reliability.
    useCase = new ForgotPasswordUseCase(mockAuthService as any);
    authService = mockAuthService as any;
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  // TODO: Implementar tests
  // - should call authService.forgotPassword with correct email
  // - should return the result from authService.forgotPassword
  // - should handle errors from authService.forgotPassword
});
