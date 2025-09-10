import { Test, TestingModule } from '@nestjs/testing';
import { LoginUseCase } from './login.use-case';
import { AuthService } from '../services/auth.service';
import {
  InvalidCredentialsException,
  InactiveUserException,
} from '../../domain/exceptions';
import { mockLoginDto } from '../../../test/mocks/auth/login-dto.mock';
import {
  mockUser,
  mockInactiveUser,
} from '../../../test/mocks/user/login-user.mock';
import {
  createMockAuthService,
  MockAuthService,
} from '../../../test/mocks/auth/auth-service.mock';
import { mockJwtResponse } from '../../../test/mocks/auth/jwt-response.mock';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let authService: MockAuthService;

  beforeEach(async () => {
    const mockAuthService = createMockAuthService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });
  });

  describe('execute', () => {
    describe('Successful Login', () => {
      it('should return JWT when credentials are valid and user is active', async () => {
        // Arrange
        authService.validateUser.mockResolvedValue(mockUser);
        authService.generateJWT.mockResolvedValue(mockJwtResponse);

        // Act
        const result = await useCase.execute(mockLoginDto);

        // Assert
        expect(authService.validateUser).toHaveBeenCalledWith(
          mockLoginDto.email,
          mockLoginDto.password,
        );
        expect(mockUser.isActive).toHaveBeenCalled();
        expect(authService.generateJWT).toHaveBeenCalledWith(mockUser);
        expect(result).toEqual(mockJwtResponse);
      });
    });

    describe('Authentication Failures', () => {
      it('should throw InvalidCredentialsException when user not found', async () => {
        // Arrange
        authService.validateUser.mockResolvedValue(null);

        // Act & Assert
        await expect(useCase.execute(mockLoginDto)).rejects.toThrow(
          InvalidCredentialsException,
        );
        expect(authService.validateUser).toHaveBeenCalledWith(
          mockLoginDto.email,
          mockLoginDto.password,
        );
        expect(authService.generateJWT).not.toHaveBeenCalled();
      });

      it('should throw InactiveUserException when user is inactive', async () => {
        // Arrange
        authService.validateUser.mockResolvedValue(mockInactiveUser);

        // Act & Assert
        await expect(useCase.execute(mockLoginDto)).rejects.toThrow(
          InactiveUserException,
        );
        expect(authService.validateUser).toHaveBeenCalledWith(
          mockLoginDto.email,
          mockLoginDto.password,
        );
        expect(mockInactiveUser.isActive).toHaveBeenCalled();
        expect(authService.generateJWT).not.toHaveBeenCalled();
      });
    });

    describe('Service Integration', () => {
      it('should call authService.validateUser with correct parameters', async () => {
        // Arrange
        authService.validateUser.mockResolvedValue(mockUser);
        authService.generateJWT.mockResolvedValue(mockJwtResponse);

        // Act
        await useCase.execute(mockLoginDto);

        // Assert
        expect(authService.validateUser).toHaveBeenCalledTimes(1);
        expect(authService.validateUser).toHaveBeenCalledWith(
          mockLoginDto.email,
          mockLoginDto.password,
        );
      });

      it('should call authService.generateJWT when user is valid and active', async () => {
        // Arrange
        authService.validateUser.mockResolvedValue(mockUser);
        authService.generateJWT.mockResolvedValue(mockJwtResponse);

        // Act
        await useCase.execute(mockLoginDto);

        // Assert
        expect(authService.generateJWT).toHaveBeenCalledTimes(1);
        expect(authService.generateJWT).toHaveBeenCalledWith(mockUser);
      });

      it('should not call authService.generateJWT when user validation fails', async () => {
        // Arrange
        authService.validateUser.mockResolvedValue(null);

        // Act & Assert
        await expect(useCase.execute(mockLoginDto)).rejects.toThrow();
        expect(authService.generateJWT).not.toHaveBeenCalled();
      });

      it('should not call authService.generateJWT when user is inactive', async () => {
        // Arrange
        authService.validateUser.mockResolvedValue(mockInactiveUser);

        // Act & Assert
        await expect(useCase.execute(mockLoginDto)).rejects.toThrow();
        expect(authService.generateJWT).not.toHaveBeenCalled();
      });
    });

    describe('Error Handling', () => {
      it('should propagate errors from authService.validateUser', async () => {
        // Arrange
        const error = new Error('Database connection failed');
        authService.validateUser.mockRejectedValue(error);

        // Act & Assert
        await expect(useCase.execute(mockLoginDto)).rejects.toThrow(error);
        expect(authService.generateJWT).not.toHaveBeenCalled();
      });

      it('should propagate errors from authService.generateJWT', async () => {
        // Arrange
        const error = new Error('JWT generation failed');
        authService.validateUser.mockResolvedValue(mockUser);
        authService.generateJWT.mockRejectedValue(error);

        // Act & Assert
        await expect(useCase.execute(mockLoginDto)).rejects.toThrow(error);
        expect(authService.validateUser).toHaveBeenCalled();
        expect(mockUser.isActive).toHaveBeenCalled();
      });
    });
  });
});
