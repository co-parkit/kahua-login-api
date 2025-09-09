import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import config from '../../config';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: config.KEY,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get(config.KEY);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  // TODO: Implementar tests
  // - should validate JWT payload correctly
  // - should return payload when token is valid
  // - should handle token expiration
  // - should handle invalid tokens
  // - should use correct JWT secret from config
  // - should extract token from Authorization header
});
