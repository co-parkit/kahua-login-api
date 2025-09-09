import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { IAuthService } from '../../domain/interfaces/auth.service.interface';
import { UserModel } from '../../domain/models/user.model';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: jest.Mocked<IAuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      validateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: 'IAuthService',
          useValue: mockAuthService,
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get('IAuthService');
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  // TODO: Implementar tests
  // - should validate user credentials successfully
  // - should return user when credentials are valid
  // - should throw UnauthorizedException when user not found
  // - should throw UnauthorizedException when password is invalid
  // - should call authService.validateUser with correct parameters
  // - should use email as username field
  // - should use password as password field
});
