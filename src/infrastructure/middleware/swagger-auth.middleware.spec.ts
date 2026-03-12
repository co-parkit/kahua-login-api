import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { SwaggerAuthMiddleware } from './swagger-auth.middleware';
import config from '../../config';

const createMockRequest = (overrides: Partial<Request> = {}): Request =>
  ({
    path: '/docs',
    headers: {},
    ip: '127.0.0.1',
    ...overrides,
  } as Request);

const createMockResponse = (): Response => {
  const res: any = {
    setHeader: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res as Response;
};

describe('SwaggerAuthMiddleware', () => {
  let middleware: SwaggerAuthMiddleware;
  let configService: jest.Mocked<ConfigService>;
  let next: NextFunction;

  beforeEach(() => {
    next = jest.fn();
    configService = {
      get: jest.fn(),
    } as any;
    middleware = new SwaggerAuthMiddleware(configService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('non-production', () => {
    beforeEach(() => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return 'development';
        if (key === 'config') return { swagger: { enabled: true } };
        return undefined;
      });
    });

    it('should call next() without auth when NODE_ENV is not production', () => {
      const req = createMockRequest();
      const res = createMockResponse();

      middleware.use(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('production - non-swagger route', () => {
    beforeEach(() => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return 'production';
        if (key === 'config') return { swagger: { enabled: true } };
        return undefined;
      });
    });

    it('should call next() when path is not swagger', () => {
      const req = createMockRequest({ path: '/api/health' });
      const res = createMockResponse();

      middleware.use(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('production - swagger disabled', () => {
    beforeEach(() => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return 'production';
        if (key === 'config') return { swagger: { enabled: false } };
        return undefined;
      });
    });

    it('should return 401 when swagger is disabled', () => {
      const req = createMockRequest({ path: '/docs' });
      const res = createMockResponse();

      middleware.use(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.setHeader).toHaveBeenCalledWith(
        'WWW-Authenticate',
        expect.stringContaining('Basic realm='),
      );
    });
  });

  describe('production - missing credentials config', () => {
    beforeEach(() => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return 'production';
        if (key === 'config') return { swagger: { enabled: true } };
        return undefined;
      });
    });

    it('should return 401 when swagger credentials not configured', () => {
      const req = createMockRequest({ path: '/docs' });
      const res = createMockResponse();

      middleware.use(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('production - with valid config', () => {
    const validUsername = 'admin';
    const validPassword = 'secret';

    beforeEach(() => {
      const appConfig = {
        swagger: {
          enabled: true,
          username: validUsername,
          password: validPassword,
        },
      };
      configService.get.mockImplementation((key: string | symbol) => {
        if (key === 'NODE_ENV') return 'production';
        // config.KEY is 'CONFIGURATION(config)' in NestJS ConfigModule
        if (key === config.KEY || key === 'config') return appConfig;
        return undefined;
      });
    });

    it('should return 401 when Authorization header is missing', () => {
      const req = createMockRequest({ path: '/docs', headers: {} });
      const res = createMockResponse();

      middleware.use(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return 401 when Authorization is not Basic', () => {
      const req = createMockRequest({
        path: '/docs',
        headers: { authorization: 'Bearer token' },
      });
      const res = createMockResponse();

      middleware.use(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should call next() when Basic credentials are valid', () => {
      const credentials = Buffer.from(
        `${validUsername}:${validPassword}`,
        'ascii',
      ).toString('base64');
      const req = createMockRequest({
        path: '/docs',
        headers: { authorization: `Basic ${credentials}` },
      });
      const res = createMockResponse();

      middleware.use(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 401 when Basic credentials are invalid', () => {
      const credentials = Buffer.from('wrong:wrong', 'ascii').toString(
        'base64',
      );
      const req = createMockRequest({
        path: '/docs',
        headers: { authorization: `Basic ${credentials}` },
      });
      const res = createMockResponse();

      middleware.use(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return 401 when Authorization header decode throws', () => {
      const req = createMockRequest({
        path: '/docs',
        headers: { authorization: 'Basic invalid!!!base64!!!' },
      });
      const res = createMockResponse();

      middleware.use(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});
