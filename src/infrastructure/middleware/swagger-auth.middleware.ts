import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import config from '../../config';
import type { ConfigType } from '@nestjs/config';

/**
 * Middleware for basic HTTP authentication of Swagger
 * Protects the access to the documentation only in production
 *
 */
@Injectable()
export class SwaggerAuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SwaggerAuthMiddleware.name);

  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const appConfig = this.configService.get<ConfigType<typeof config>>(
      config.KEY,
    );
    const nodeEnv = this.configService.get<string>('NODE_ENV') || 'development';

    // Only apply authentication in production
    if (nodeEnv !== 'production') {
      this.logger.debug(`Acceso libre a Swagger en entorno: ${nodeEnv}`);
      return next();
    }

    // Verificar si la ruta es de Swagger
    if (!this.isSwaggerRoute(req.path)) {
      return next();
    }

    // Check if Swagger is enabled
    if (!appConfig?.swagger?.enabled) {
      this.logger.warn('Swagger está deshabilitado en configuración');
      return this.sendUnauthorizedResponse(
        res,
        'Swagger documentation is disabled',
      );
    }

    // Get credentials from configuration
    const validUsername = appConfig?.swagger?.username;
    const validPassword = appConfig?.swagger?.password;
    const realm = appConfig?.swagger?.realm || 'Swagger Documentation';

    if (!validUsername || !validPassword) {
      this.logger.error(
        'Credenciales de Swagger no configuradas correctamente',
      );
      return this.sendUnauthorizedResponse(
        res,
        'Swagger credentials not configured',
      );
    }

    // Get authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Basic ')) {
      this.logger.warn(
        `Intento de acceso sin autenticación desde IP: ${req.ip}`,
      );
      return this.sendUnauthorizedResponse(res, realm);
    }

    try {
      // Decode credentials
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString(
        'ascii',
      );
      const [username, password] = credentials.split(':');

      // Validar credenciales
      if (username === validUsername && password === validPassword) {
        this.logger.log(
          `Acceso autorizado a Swagger para usuario: ${username} desde IP: ${req.ip}`,
        );
        return next();
      }

      this.logger.warn(
        `Credenciales inválidas para usuario: ${username} desde IP: ${req.ip}`,
      );
      return this.sendUnauthorizedResponse(res, realm);
    } catch (error) {
      this.logger.error(
        `Error en autenticación de Swagger: ${
          error instanceof Error ? error.message : 'Unknown error'
        } desde IP: ${req.ip}`,
      );
      return this.sendUnauthorizedResponse(res, realm);
    }
  }

  /**
   * Check if the route is of Swagger
   */
  private isSwaggerRoute(path: string): boolean {
    const swaggerRoutes = [
      '/docs',
      '/docs-json',
      '/docs-yaml',
      '/swagger-ui',
      '/swagger-ui/',
      '/swagger-ui-bundle.js',
      '/swagger-ui-standalone-preset.js',
      '/swagger-ui.css',
    ];

    return swaggerRoutes.some(
      (route) => path.startsWith(route) || path === route,
    );
  }

  /**
   * Send unauthorized response with WWW-Authenticate header
   */
  private sendUnauthorizedResponse(res: Response, realm: string): void {
    res.setHeader('WWW-Authenticate', `Basic realm="${realm}"`);
    res.status(401).json({
      statusCode: 401,
      message: 'Unauthorized access to Swagger documentation',
      error: 'Unauthorized',
      timestamp: new Date().toISOString(),
      hint: 'Provide valid credentials to access the documentation',
    });
  }
}
