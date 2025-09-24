export const USER_PLATFORM = 1;

export const JWT_EXPIRES_IN_RESET = '15m';
export const JWT_SECRET_KEY = 'jwtSecret';

export const EMAIL_SENT = {
  TEMPLATE_RESET: 'password-reset',
  ACTION_RESET: 'recuperar',
};

export const API_ENDPOINTS = {
  EMAIL_SEND_RESET: '/email/send-test',
};

/**
 * Constants for paths to avoid deep relative imports
 */
export const PATHS = {
  // Domain
  DOMAIN: 'src/domain',
  ENTITIES: 'src/domain/entities',
  MODELS: 'src/domain/models',
  INTERFACES: 'src/domain/interfaces',
  EXCEPTIONS: 'src/domain/exceptions',
  VALIDATORS: 'src/domain/validators',

  // Application
  APPLICATION: 'src/application',
  USE_CASES: 'src/application/use-cases',
  SERVICES: 'src/application/services',
  DTOS: 'src/application/dtos',

  // Infrastructure
  INFRASTRUCTURE: 'src/infrastructure',
  CONTROLLERS: 'src/infrastructure/controllers',
  REPOSITORIES: 'src/infrastructure/repositories',
  STRATEGIES: 'src/infrastructure/strategies',
  GUARDS: 'src/infrastructure/guards',
  INTERCEPTORS: 'src/infrastructure/interceptors',
  DECORATORS: 'src/infrastructure/decorators',
  MODULES: 'src/infrastructure/modules',

  // Config
  CONFIG: 'src/config',
  SHARED: 'src/shared',
} as const;
