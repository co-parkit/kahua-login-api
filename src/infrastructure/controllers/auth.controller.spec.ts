import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { ForgotPasswordUseCase } from '../../application/use-cases/forgot-password.use-case';
import { UserModel } from '../../domain/models/user.model';
import { AuthRateLimitGuard } from '../guards/auth-rate-limit.guard';
import {
  mockUserModel,
  mockLoginDto,
  mockCreateUserDto,
  mockForgotPasswordDto,
  mockAuthResponse,
  mockForgotPasswordResponse,
  mockLoginUseCase,
  mockRegisterUseCase,
  mockForgotPasswordUseCase,
} from '../../../test/mocks/controllers/auth-controller.mock';

describe('AuthController', () => {
  let controller: AuthController;
  let loginUseCase: jest.Mocked<LoginUseCase>;
  let registerUseCase: jest.Mocked<RegisterUseCase>;
  let forgotPasswordUseCase: jest.Mocked<ForgotPasswordUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: mockLoginUseCase,
        },
        {
          provide: RegisterUseCase,
          useValue: mockRegisterUseCase,
        },
        {
          provide: ForgotPasswordUseCase,
          useValue: mockForgotPasswordUseCase,
        },
      ],
    })
      .overrideGuard(AuthRateLimitGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    loginUseCase = module.get(LoginUseCase);
    registerUseCase = module.get(RegisterUseCase);
    forgotPasswordUseCase = module.get(ForgotPasswordUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      loginUseCase.execute.mockResolvedValue(mockAuthResponse);

      const result = await controller.login(mockUserModel, mockLoginDto);

      expect(result).toEqual(mockAuthResponse);
      expect(loginUseCase.execute).toHaveBeenCalledWith(mockLoginDto);
      expect(loginUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should call login use case with correct parameters', async () => {
      loginUseCase.execute.mockResolvedValue(mockAuthResponse);

      await controller.login(mockUserModel, mockLoginDto);

      expect(loginUseCase.execute).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should return proper response format', async () => {
      loginUseCase.execute.mockResolvedValue(mockAuthResponse);

      const result = await controller.login(mockUserModel, mockLoginDto);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.user).toEqual(mockAuthResponse.user);
    });

    it('should handle errors from login use case', async () => {
      const error = new Error('Login failed');
      loginUseCase.execute.mockRejectedValue(error);

      await expect(
        controller.login(mockUserModel, mockLoginDto),
      ).rejects.toThrow('Login failed');

      expect(loginUseCase.execute).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should work with different user types', async () => {
      const adminUser = {
        ...mockUserModel,
        idRole: 2,
        email: 'admin@example.com',
        toPlainObject: jest.fn().mockReturnValue({
          id: 1,
          email: 'admin@example.com',
          userName: 'adminuser',
          name: 'Admin',
          lastName: 'User',
          idRole: 2,
          idStatus: 1,
        }),
      } as unknown as UserModel;

      loginUseCase.execute.mockResolvedValue(mockAuthResponse);

      const result = await controller.login(adminUser, mockLoginDto);

      expect(result).toEqual(mockAuthResponse);
      expect(loginUseCase.execute).toHaveBeenCalledWith(mockLoginDto);
    });
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      registerUseCase.execute.mockResolvedValue(mockUserModel);

      const result = await controller.register(mockCreateUserDto);

      expect(result).toEqual({
        userId: mockUserModel.id,
        user: mockUserModel.toPlainObject(),
      });
      expect(registerUseCase.execute).toHaveBeenCalledWith(mockCreateUserDto);
      expect(registerUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should call register use case with correct parameters', async () => {
      registerUseCase.execute.mockResolvedValue(mockUserModel);

      await controller.register(mockCreateUserDto);

      expect(registerUseCase.execute).toHaveBeenCalledWith(mockCreateUserDto);
    });

    it('should return proper response format', async () => {
      registerUseCase.execute.mockResolvedValue(mockUserModel);

      const result = await controller.register(mockCreateUserDto);

      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('user');
      expect(result.userId).toBe(mockUserModel.id);
      expect(result.user).toEqual(mockUserModel.toPlainObject());
    });

    it('should handle errors from register use case', async () => {
      const error = new Error('Registration failed');
      registerUseCase.execute.mockRejectedValue(error);

      await expect(controller.register(mockCreateUserDto)).rejects.toThrow(
        'Registration failed',
      );

      expect(registerUseCase.execute).toHaveBeenCalledWith(mockCreateUserDto);
    });

    it('should work with different user data', async () => {
      const differentUser = {
        ...mockUserModel,
        email: 'different@example.com',
        userName: 'differentuser',
        toPlainObject: jest.fn().mockReturnValue({
          id: 1,
          email: 'different@example.com',
          userName: 'differentuser',
          name: 'Test',
          lastName: 'User',
          idRole: 1,
          idStatus: 1,
        }),
      } as unknown as UserModel;
      registerUseCase.execute.mockResolvedValue(differentUser);

      const result = await controller.register(mockCreateUserDto);

      expect(result.userId).toBe(differentUser.id);
      expect(result.user).toEqual(differentUser.toPlainObject());
    });
  });

  describe('forgotPassword', () => {
    it('should handle forgot password request successfully', async () => {
      forgotPasswordUseCase.execute.mockResolvedValue(
        mockForgotPasswordResponse,
      );

      const result = await controller.forgotPassword(mockForgotPasswordDto);

      expect(result).toEqual(mockForgotPasswordResponse);
      expect(forgotPasswordUseCase.execute).toHaveBeenCalledWith(
        mockForgotPasswordDto,
      );
      expect(forgotPasswordUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should call forgot password use case with correct parameters', async () => {
      forgotPasswordUseCase.execute.mockResolvedValue(
        mockForgotPasswordResponse,
      );

      await controller.forgotPassword(mockForgotPasswordDto);

      expect(forgotPasswordUseCase.execute).toHaveBeenCalledWith(
        mockForgotPasswordDto,
      );
    });

    it('should return proper response format', async () => {
      forgotPasswordUseCase.execute.mockResolvedValue(
        mockForgotPasswordResponse,
      );

      const result = await controller.forgotPassword(mockForgotPasswordDto);

      expect(result).toHaveProperty('message');
      expect(result.message).toBe('Password reset email sent successfully');
    });

    it('should handle errors from forgot password use case', async () => {
      const error = new Error('Forgot password failed');
      forgotPasswordUseCase.execute.mockRejectedValue(error);

      await expect(
        controller.forgotPassword(mockForgotPasswordDto),
      ).rejects.toThrow('Forgot password failed');

      expect(forgotPasswordUseCase.execute).toHaveBeenCalledWith(
        mockForgotPasswordDto,
      );
    });

    it('should work with different email addresses', async () => {
      const differentEmail = { email: 'different@example.com' };
      forgotPasswordUseCase.execute.mockResolvedValue(
        mockForgotPasswordResponse,
      );

      const result = await controller.forgotPassword(differentEmail);

      expect(result).toEqual(mockForgotPasswordResponse);
      expect(forgotPasswordUseCase.execute).toHaveBeenCalledWith(
        differentEmail,
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle null user in login', async () => {
      loginUseCase.execute.mockResolvedValue(mockAuthResponse);

      const result = await controller.login(null as any, mockLoginDto);

      expect(result).toEqual(mockAuthResponse);
      expect(loginUseCase.execute).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle empty DTOs', async () => {
      const emptyLoginDto = { email: '', password: '' };
      const emptyCreateDto = {
        email: '',
        password: '',
        name: '',
        lastName: '',
        userName: '',
        phone: '',
        idRole: 1,
      };
      const emptyForgotDto = { email: '' };

      loginUseCase.execute.mockResolvedValue(mockAuthResponse);
      registerUseCase.execute.mockResolvedValue(mockUserModel);
      forgotPasswordUseCase.execute.mockResolvedValue(
        mockForgotPasswordResponse,
      );

      await controller.login(mockUserModel, emptyLoginDto);
      await controller.register(emptyCreateDto);
      await controller.forgotPassword(emptyForgotDto);

      expect(loginUseCase.execute).toHaveBeenCalledWith(emptyLoginDto);
      expect(registerUseCase.execute).toHaveBeenCalledWith(emptyCreateDto);
      expect(forgotPasswordUseCase.execute).toHaveBeenCalledWith(
        emptyForgotDto,
      );
    });

    it('should handle undefined responses from use cases', async () => {
      loginUseCase.execute.mockResolvedValue(undefined as any);
      forgotPasswordUseCase.execute.mockResolvedValue(undefined as any);

      const loginResult = await controller.login(mockUserModel, mockLoginDto);
      const forgotResult = await controller.forgotPassword(
        mockForgotPasswordDto,
      );

      expect(loginResult).toBeUndefined();
      expect(forgotResult).toBeUndefined();

      registerUseCase.execute.mockResolvedValue(undefined as any);
      await expect(controller.register(mockCreateUserDto)).rejects.toThrow();
    });
  });
});
