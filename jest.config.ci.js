module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', {
      tsconfig: {
        sourceMap: true,
        inlineSourceMap: false,
      },
    }],
  },
  globals: {
    'ts-jest': {
      useESM: false,
    },
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.spec.ts',
    '!**/*.interface.ts',
    '!**/*.dto.ts',
    '!**/*.entity.ts',
    '!**/main.ts',
    '!**/index.ts',
    '!**/*.config.ts',
    '!**/*.config.js',
  ],
  coverageDirectory: '../coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json',
    'text-summary',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/../test/setup.ts'],
  testTimeout: 30000,
  verbose: true,
  collectCoverage: true, // Always collect coverage in CI
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/test/',
    '\\.spec\\.ts$',
    '\\.interface\\.ts$',
    '\\.dto\\.ts$',
    '\\.entity\\.ts$',
  ],
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleDirectories: ['node_modules', 'src'],
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))',
  ],
  // Configuración específica para CI
  maxWorkers: 1, // Ejecutar tests en secuencia para evitar conflictos de DB
  forceExit: true, // Forzar salida después de completar tests
  detectOpenHandles: true, // Detectar handles abiertos que impidan la salida
};
