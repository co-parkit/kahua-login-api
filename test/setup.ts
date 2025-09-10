// Jest setup file
// This file is executed before all tests

// Increase timeout for integration tests
jest.setTimeout(30000);

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.DATABASE_URL = 'sqlite::memory:';
process.env.HOST = 'localhost';
process.env.PORT_DATABASE = '5432';
process.env.USER_DATABASE = 'test';
process.env.PASSWORD_DATABASE = 'test';
process.env.NAME_DATABASE = 'test_db';
process.env.LOG_LEVEL = 'error';

const originalConsole = { ...console };
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Global test setup
beforeAll(() => {
  // Configuración global antes de todos los tests
  console.log('🧪 Starting test suite with SQLite in-memory database');
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
  global.console = originalConsole;
  console.log('✅ Test suite completed');
});
