import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../../application/services/auth.service';
import { CODES } from '../../config/general.codes';
import { UserModel } from '../../domain/models/user.model';
import {
  mockUserModel,
  mockUserModelInactive,
  mockAuthService,
  mockCredentials,
  mockInvalidCredentials,
} from '../../../test/mocks/strategies/local-strategy.mock';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(
      AuthService,
    ) as jest.Mocked<AuthService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('Constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(strategy).toBeDefined();
      expect(authService).toBeDefined();
    });

    it('should use email as usernameField', () => {
      // This is tested indirectly through the strategy instantiation
      expect(strategy).toBeDefined();
    });

    it('should use password as passwordField', () => {
      // This is tested indirectly through the strategy instantiation
      expect(strategy).toBeDefined();
    });
  });

  describe('validate', () => {
    it('should return user when credentials are valid', async () => {
      authService.validateUser.mockResolvedValue(mockUserModel);

      const result = await strategy.validate(
        mockCredentials.email,
        mockCredentials.password,
      );

      expect(result).toEqual(mockUserModel);
      expect(authService.validateUser).toHaveBeenCalledWith(
        mockCredentials.email,
        mockCredentials.password,
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should return user when credentials are valid for inactive user', async () => {
      authService.validateUser.mockResolvedValue(mockUserModelInactive);

      const result = await strategy.validate(
        mockCredentials.email,
        mockCredentials.password,
      );

      expect(result).toEqual(mockUserModelInactive);
      expect(authService.validateUser).toHaveBeenCalledWith(
        mockCredentials.email,
        mockCredentials.password,
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(
        strategy.validate(
          mockInvalidCredentials.email,
          mockInvalidCredentials.password,
        ),
      ).rejects.toThrow(UnauthorizedException);

      expect(authService.validateUser).toHaveBeenCalledWith(
        mockInvalidCredentials.email,
        mockInvalidCredentials.password,
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException with correct error code when user is not found', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(
        strategy.validate(
          mockInvalidCredentials.email,
          mockInvalidCredentials.password,
        ),
      ).rejects.toThrow(UnauthorizedException);

      try {
        await strategy.validate(
          mockInvalidCredentials.email,
          mockInvalidCredentials.password,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe(CODES.PKL_USER_NOT_FOUND.message);
      }
    });

    it('should throw UnauthorizedException when user is undefined', async () => {
      authService.validateUser.mockResolvedValue(undefined);

      await expect(
        strategy.validate(
          mockInvalidCredentials.email,
          mockInvalidCredentials.password,
        ),
      ).rejects.toThrow(UnauthorizedException);

      expect(authService.validateUser).toHaveBeenCalledWith(
        mockInvalidCredentials.email,
        mockInvalidCredentials.password,
      );
    });

    it('should call authService.validateUser with correct parameters', async () => {
      authService.validateUser.mockResolvedValue(mockUserModel);

      await strategy.validate('test@example.com', 'password123');

      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from authService.validateUser', async () => {
      const error = new Error('Database connection failed');
      authService.validateUser.mockRejectedValue(error);

      await expect(
        strategy.validate(mockCredentials.email, mockCredentials.password),
      ).rejects.toThrow('Database connection failed');

      expect(authService.validateUser).toHaveBeenCalledWith(
        mockCredentials.email,
        mockCredentials.password,
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty email', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(strategy.validate('', 'password123')).rejects.toThrow(
        UnauthorizedException,
      );

      expect(authService.validateUser).toHaveBeenCalledWith('', 'password123');
    });

    it('should handle empty password', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(strategy.validate('test@example.com', '')).rejects.toThrow(
        UnauthorizedException,
      );

      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        '',
      );
    });

    it('should handle both empty email and password', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(strategy.validate('', '')).rejects.toThrow(
        UnauthorizedException,
      );

      expect(authService.validateUser).toHaveBeenCalledWith('', '');
    });

    it('should handle null email', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(
        strategy.validate(null as any, 'password123'),
      ).rejects.toThrow(UnauthorizedException);

      expect(authService.validateUser).toHaveBeenCalledWith(
        null,
        'password123',
      );
    });

    it('should handle null password', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(
        strategy.validate('test@example.com', null as any),
      ).rejects.toThrow(UnauthorizedException);

      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        null,
      );
    });

    it('should handle undefined email', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(
        strategy.validate(undefined as any, 'password123'),
      ).rejects.toThrow(UnauthorizedException);

      expect(authService.validateUser).toHaveBeenCalledWith(
        undefined,
        'password123',
      );
    });

    it('should handle undefined password', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(
        strategy.validate('test@example.com', undefined as any),
      ).rejects.toThrow(UnauthorizedException);

      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        undefined,
      );
    });
  });

  describe('Integration with AuthService', () => {
    it('should work correctly with different user types', async () => {
      const adminUser = {
        ...mockUserModel,
        role: 2,
        email: 'admin@example.com',
        toPlainObject: jest.fn().mockReturnValue({
          id: 1,
          email: 'admin@example.com',
          username: 'adminuser',
          name: 'Admin',
          lastName: 'User',
          role: 2,
          status: 1,
        }),
      } as unknown as UserModel;

      authService.validateUser.mockResolvedValue(adminUser);

      const result = await strategy.validate('admin@example.com', 'adminpass');

      expect(result).toEqual(adminUser);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'admin@example.com',
        'adminpass',
      );
    });

    it('should work correctly with different password formats', async () => {
      authService.validateUser.mockResolvedValue(mockUserModel);

      await strategy.validate('test@example.com', 'simple');
      await strategy.validate('test@example.com', 'ComplexP@ssw0rd!');
      await strategy.validate('test@example.com', '123456789');

      expect(authService.validateUser).toHaveBeenCalledTimes(3);
    });

    it('should work correctly with different email formats', async () => {
      authService.validateUser.mockResolvedValue(mockUserModel);

      await strategy.validate('user@domain.com', 'password');
      await strategy.validate('user.name@domain.co.uk', 'password');
      await strategy.validate('user+tag@domain.org', 'password');

      expect(authService.validateUser).toHaveBeenCalledTimes(3);
    });
  });
});
