/**
 * Configuración específica para pruebas
 * Define variables de entorno y configuraciones para el entorno de testing
 */
export const testConfig = {
  database: {
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    autoLoadEntities: true,
    logging: false,
    dropSchema: true,
  },

  jwt: {
    secret: 'test-jwt-secret-key-for-testing-only',
    expiresIn: '1h',
  },

  throttler: {
    ttl: 1000,
    limit: 100,
  },

  logging: {
    level: 'error',
  },

  email: {
    enabled: false,
    mock: true,
  },
};
