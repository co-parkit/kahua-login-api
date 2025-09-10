import { ForgotPasswordUseCase } from './forgot-password.use-case';
import { AuthService } from '../services/auth.service';
import { ForgotPasswordDto } from '../dtos/login.dto';
import { Response } from '../../domain/models/response.model';

describe('ForgotPasswordUseCase', () => {
  let useCase: ForgotPasswordUseCase;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      forgotPassword: jest.fn(),
    };
    useCase = new ForgotPasswordUseCase(mockAuthService as any);
    authService = mockAuthService as any;
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should call authService.forgotPassword with correct email', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'test@test.com',
      };
      const expectedResult = Response.success(
        { success: true, message: 'Email sent' },
        'SUCCESS',
      );

      authService.forgotPassword.mockResolvedValue(expectedResult);

      await useCase.execute(forgotPasswordDto);

      expect(authService.forgotPassword).toHaveBeenCalledWith('test@test.com');
    });

    it('should return the result from authService.forgotPassword', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'test@test.com',
      };
      const expectedResult = Response.success(
        { success: true, message: 'Email sent' },
        'SUCCESS',
      );

      authService.forgotPassword.mockResolvedValue(expectedResult);

      const result = await useCase.execute(forgotPasswordDto);

      expect(result).toEqual(expectedResult);
    });

    it('should handle errors from authService.forgotPassword', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'test@test.com',
      };
      const error = new Error('Email service unavailable');

      authService.forgotPassword.mockRejectedValue(error);

      await expect(useCase.execute(forgotPasswordDto)).rejects.toThrow(
        'Email service unavailable',
      );
    });
  });
});
