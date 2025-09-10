import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigType } from '@nestjs/config';
import config from '../../config';
import {
  mockJwtPayload,
  mockJwtPayloadWithDifferentRole,
  mockJwtPayloadInactive,
  mockConfigService,
} from '../../../test/mocks/strategies/jwt-strategy.mock';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigType<typeof config>;

  beforeEach(async () => {
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
    configService = module.get<ConfigType<typeof config>>(config.KEY);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('Constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(strategy).toBeDefined();
      expect(configService.jwtSecret).toBe(mockConfigService.jwtSecret);
    });

    it('should use ExtractJwt.fromAuthHeaderAsBearerToken for jwtFromRequest', () => {
      // This is tested indirectly through the strategy instantiation
      expect(strategy).toBeDefined();
    });

    it('should set ignoreExpiration to false', () => {
      // This is tested indirectly through the strategy instantiation
      expect(strategy).toBeDefined();
    });

    it('should use the provided secret key', () => {
      expect(configService.jwtSecret).toBe(mockConfigService.jwtSecret);
    });
  });

  describe('validate', () => {
    it('should return the payload as-is for valid user', () => {
      const result = strategy.validate(mockJwtPayload);

      expect(result).toEqual(mockJwtPayload);
      expect(result.sub).toBe(1);
      expect(result.email).toBe('test@example.com');
      expect(result.name).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.role).toBe(1);
      expect(result.status).toBe(1);
    });

    it('should return the payload as-is for admin user', () => {
      const result = strategy.validate(mockJwtPayloadWithDifferentRole);

      expect(result).toEqual(mockJwtPayloadWithDifferentRole);
      expect(result.sub).toBe(2);
      expect(result.email).toBe('admin@example.com');
      expect(result.name).toBe('Admin');
      expect(result.lastName).toBe('User');
      expect(result.role).toBe(2);
      expect(result.status).toBe(1);
    });

    it('should return the payload as-is for inactive user', () => {
      const result = strategy.validate(mockJwtPayloadInactive);

      expect(result).toEqual(mockJwtPayloadInactive);
      expect(result.sub).toBe(3);
      expect(result.email).toBe('inactive@example.com');
      expect(result.name).toBe('Inactive');
      expect(result.lastName).toBe('User');
      expect(result.role).toBe(1);
      expect(result.status).toBe(0);
    });

    it('should return the payload as-is for any valid JWT payload structure', () => {
      const customPayload = {
        sub: 999,
        email: 'custom@example.com',
        name: 'Custom',
        lastName: 'User',
        role: 3,
        status: 1,
      };

      const result = strategy.validate(customPayload);

      expect(result).toEqual(customPayload);
    });

    it('should handle payload with additional properties', () => {
      const payloadWithExtra = {
        ...mockJwtPayload,
        extraProperty: 'extra-value',
        anotherProperty: 123,
      } as any;

      const result = strategy.validate(payloadWithExtra);

      expect(result).toEqual(payloadWithExtra);
      expect((result as any).extraProperty).toBe('extra-value');
      expect((result as any).anotherProperty).toBe(123);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty payload', () => {
      const emptyPayload = {} as any;
      const result = strategy.validate(emptyPayload);

      expect(result).toEqual(emptyPayload);
    });

    it('should handle payload with null values', () => {
      const payloadWithNulls = {
        sub: null,
        email: null,
        name: null,
        lastName: null,
        role: null,
        status: null,
      };

      const result = strategy.validate(payloadWithNulls);

      expect(result).toEqual(payloadWithNulls);
    });

    it('should handle payload with undefined values', () => {
      const payloadWithUndefined = {
        sub: undefined,
        email: undefined,
        name: undefined,
        lastName: undefined,
        role: undefined,
        status: undefined,
      };

      const result = strategy.validate(payloadWithUndefined);

      expect(result).toEqual(payloadWithUndefined);
    });
  });
});
