import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { AuthService } from './auth.service';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UserModel } from '../../domain/models/user.model';
import { MyLogger } from '../../config/logger';
import { CODES } from '../../config/general.codes';
import { Response } from '../../domain/models/response.model';
import { USER_PLATFORM } from '../../config/constants';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let httpService: jest.Mocked<HttpService>;
  let logger: jest.Mocked<MyLogger>;

  let mockUser: jest.Mocked<UserModel>;

  beforeEach(async () => {
    // Create mock user
    mockUser = {
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
      hasRole: jest.fn().mockReturnValue(true),
    } as unknown as jest.Mocked<UserModel>;

    const mockUserRepository = {
      validateCredentials: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        const config = {
          jwtSecret: 'test-secret',
          JWT_SECRET: 'test-secret',
          FRONTEND_URL: 'http://localhost:3000',
          'config.getApi.kahuaNotification': 'http://api.notification.com',
        };
        return config[key];
      }),
    };

    const mockHttpService = {
      post: jest.fn().mockReturnValue(
        of({
          status: 201,
          data: { success: true },
          statusText: 'Created',
          headers: {} as any,
          config: {} as any,
        } as AxiosResponse),
      ),
    };

    const mockLogger = {
      error: jest.fn(),
    };

    service = new AuthService(
      mockUserRepository as any,
      mockJwtService as any,
      mockConfigService as any,
      mockHttpService as any,
      mockLogger as any,
    );

    userRepository = mockUserRepository as any;
    jwtService = mockJwtService as any;
    configService = mockConfigService as any;
    httpService = mockHttpService as any;
    logger = mockLogger as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('generateJWT', () => {
    it('should generate JWT with correct payload', async () => {
      // Arrange
      const expectedPayload = {
        email: mockUser.email,
        sub: mockUser.id,
        name: mockUser.name,
        lastName: mockUser.lastName,
        role: mockUser.idRole,
        status: mockUser.idStatus,
      };

      // Act
      const result = await service.generateJWT(mockUser);

      // Assert
      expect(jwtService.sign).toHaveBeenCalledWith(expectedPayload, {
        secret: 'test-secret',
      });
      expect(result).toEqual({
        access_token: 'mock-jwt-token',
        user: mockUser.toPlainObject(),
      });
    });

    it('should call configService.get for JWT secret', async () => {
      // Act
      await service.generateJWT(mockUser);

      // Assert
      expect(configService.get).toHaveBeenCalledWith('jwtSecret');
    });
  });

  describe('validateUser', () => {
    it('should validate user credentials correctly', async () => {
      // Arrange
      userRepository.validateCredentials.mockResolvedValue(mockUser);

      // Act
      const result = await service.validateUser('test@test.com', 'password123');

      // Assert
      expect(userRepository.validateCredentials).toHaveBeenCalledWith(
        'test@test.com',
        'password123',
      );
      expect(result).toBe(mockUser);
    });

    it('should return null when user not found', async () => {
      // Arrange
      userRepository.validateCredentials.mockResolvedValue(null);

      // Act
      const result = await service.validateUser('test@test.com', 'password123');

      // Assert
      expect(result).toBeNull();
    });

    it('should return null and log error when repository throws', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      userRepository.validateCredentials.mockRejectedValue(error);

      // Act
      const result = await service.validateUser('test@test.com', 'password123');

      // Assert
      expect(result).toBeNull();
      expect(logger.error).toHaveBeenCalledWith(
        'Error validating user',
        'Database connection failed',
      );
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(mockUser);

      // Act
      const result = await service.findByEmail('test@test.com');

      // Assert
      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@test.com');
      expect(result).toBe(mockUser);
    });

    it('should return null when user not found', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);

      // Act
      const result = await service.findByEmail('test@test.com');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findUserById', () => {
    it('should find user by id', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await service.findUserById(1);

      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toBe(mockUser);
    });

    it('should return null when user not found', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);

      // Act
      const result = await service.findUserById(999);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('forgotPassword', () => {
    it('should handle successful password reset flow', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(mockUser);
      mockUser.hasRole.mockReturnValue(true);

      // Act
      const result = await service.forgotPassword('test@test.com');

      // Assert
      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@test.com');
      expect(mockUser.hasRole).toHaveBeenCalledWith(USER_PLATFORM);
      expect(httpService.post).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Response);
    });

    it('should return user not found error when email does not exist', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);

      // Act
      const result = await service.forgotPassword('nonexistent@test.com');

      // Assert
      expect(result).toBeInstanceOf(Response);
      expect(result).toEqual(new Response(CODES.PKL_USER_NOT_FOUND));
    });

    it('should return role not allowed error when user does not have platform role', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(mockUser);
      mockUser.hasRole.mockReturnValue(false);

      // Act
      const result = await service.forgotPassword('test@test.com');

      // Assert
      expect(result).toBeInstanceOf(Response);
      expect(result).toEqual(new Response(CODES.PKL_ROLE_NOT_ALLOWED));
    });

    it('should handle email sending failure', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(mockUser);
      mockUser.hasRole.mockReturnValue(true);
      httpService.post.mockReturnValue(
        of({
          status: 500,
          data: { error: 'Email service unavailable' },
          statusText: 'Internal Server Error',
          headers: {} as any,
          config: {} as any,
        } as AxiosResponse),
      );

      // Act
      const result = await service.forgotPassword('test@test.com');

      // Assert
      expect(result).toBeInstanceOf(Response);
      expect(result).toEqual(
        new Response(CODES.KHL_NOTIFICATION_FAILED, {
          error: 'Email service unavailable',
        }),
      );
    });

    it('should handle HTTP service error', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(mockUser);
      mockUser.hasRole.mockReturnValue(true);
      const httpError = {
        response: {
          data: { error: 'Network error' },
        },
      };
      httpService.post.mockImplementation(() => {
        throw httpError;
      });

      // Act
      const result = await service.forgotPassword('test@test.com');

      // Assert
      expect(result).toBeInstanceOf(Response);
      expect(result).toEqual(
        new Response(CODES.KHL_NOTIFICATION_FAILED, {
          error: { error: 'Network error' },
        }),
      );
    });
  });

  describe('Private Methods Integration', () => {
    it('should build reset URL with correct token', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(mockUser);
      mockUser.hasRole.mockReturnValue(true);

      // Act
      await service.forgotPassword('test@test.com');

      // Assert
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: mockUser.id },
        {
          secret: 'test-secret',
          expiresIn: '15m',
        },
      );
      expect(configService.get).toHaveBeenCalledWith('FRONTEND_URL');
    });

    it('should send email with correct parameters', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(mockUser);
      mockUser.hasRole.mockReturnValue(true);

      // Act
      await service.forgotPassword('test@test.com');

      // Assert
      expect(httpService.post).toHaveBeenCalledWith(
        'http://api.notification.com/email/send-test',
        {
          to: mockUser.email,
          templateName: 'password-reset',
          variables: {
            name: mockUser.name,
            action: 'recuperar',
            resetUrl:
              'http://localhost:3000/reset-password?token=mock-jwt-token',
          },
        },
      );
    });
  });
});
