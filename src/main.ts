import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorHandlerInterceptor } from './infrastructure/interceptors/error-handler.interceptor';
import { JwtErrorInterceptor } from './infrastructure/interceptors/jwt-error.interceptor';
import { SwaggerAuthMiddleware } from './infrastructure/middleware/swagger-auth.middleware';
import config from './config';
import type { ConfigType } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = app.get<ConfigType<typeof config>>(config.KEY);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(
    new ErrorHandlerInterceptor(),
    new JwtErrorInterceptor(),
  );

  // Configurar autenticación básica para Swagger
  if (appConfig?.swagger?.enabled) {
    const swaggerAuthMiddleware = new SwaggerAuthMiddleware(configService);
    app.use(swaggerAuthMiddleware.use.bind(swaggerAuthMiddleware));
  }

  // Configurar Swagger con autenticación
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Kahua Login API')
    .setVersion('1.0.0')
    .setContact('Kahua Team', 'https://kahua.com', 'support@kahua.com')
    .setLicense('Private', 'https://kahua.com/license')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter your JWT token for authentication',
        in: 'header',
      },
      'JWT-auth',
    )
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'basic',
        name: 'Basic Auth',
        description:
          'Basic authentication for documentation access (only production)',
        in: 'header',
      },
      'basic-auth',
    )
    .addTag('auth', 'Endpoints de autenticación y autorización')
    .addTag('users', 'Gestión de usuarios y perfiles')
    .addTag('parking', 'Gestión de estacionamientos')
    .addServer('http://localhost:3000', 'Servidor de desarrollo')
    .addServer('https://api.kahua.com', 'Servidor de producción')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // Configure Swagger UI with security options
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'Kahua Login API - Documentación Segura',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { 
        display: none; 
      }
      .swagger-ui .info { 
        margin: 20px 0; 
      }
      .swagger-ui .scheme-container {
        background: #f8f9fa;
        border-radius: 4px;
        padding: 10px;
        margin: 10px 0;
      }
      .swagger-ui .auth-container {
        background: #e3f2fd;
        border-left: 4px solid #2196f3;
        padding: 10px;
        margin: 10px 0;
      }
    `,
  });

  await app.listen(configService.get<number>('development.PORT') || 3000);
}
bootstrap();
