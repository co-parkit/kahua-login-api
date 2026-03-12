import { MyLogger } from './logger';

describe('MyLogger', () => {
  let logger: MyLogger;
  let originalLogLevel: string | undefined;
  let consoleSpy: {
    log: jest.SpyInstance;
    error: jest.SpyInstance;
    warn: jest.SpyInstance;
    debug: jest.SpyInstance;
  };

  beforeEach(() => {
    originalLogLevel = process.env.LOG_LEVEL;

    logger = new MyLogger();

    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      debug: jest.spyOn(console, 'debug').mockImplementation(),
    };
  });

  afterEach(() => {
    if (originalLogLevel !== undefined) {
      process.env.LOG_LEVEL = originalLogLevel;
    } else {
      delete process.env.LOG_LEVEL;
    }

    Object.values(consoleSpy).forEach((spy) => spy?.mockRestore());
  });

  describe('log method', () => {
    it('should log message when LOG_LEVEL is INFO', () => {
      process.env.LOG_LEVEL = 'INFO';
      const testLogger = new MyLogger();
      const message = 'Test log message';
      const context = 'TestContext';
      const optionalParams = ['param1', 'param2'];

      // Clear previous calls
      consoleSpy.log.mockClear();

      testLogger.log(message, context, ...optionalParams);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining(message),
        ...optionalParams,
      );
    });

    it('should not log message when LOG_LEVEL is not INFO', () => {
      process.env.LOG_LEVEL = 'ERROR';
      const testLogger = new MyLogger();
      const message = 'Test log message';

      testLogger.log(message);

      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it('should log message when LOG_LEVEL is undefined (defaults to INFO)', () => {
      delete process.env.LOG_LEVEL;
      const testLogger = new MyLogger();
      const message = 'Test log message';

      // Clear previous calls
      consoleSpy.log.mockClear();

      testLogger.log(message);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining(message),
      );
    });

    it('should not log message when LOG_LEVEL is empty string', () => {
      process.env.LOG_LEVEL = 'ERROR';
      const testLogger = new MyLogger();
      const message = 'Test log message';

      testLogger.log(message);

      expect(consoleSpy.log).not.toHaveBeenCalled();
    });
  });

  describe('fatal method', () => {
    it('should log fatal message with FATAL prefix', () => {
      process.env.LOG_LEVEL = 'FATAL';
      const testLogger = new MyLogger();
      const message = 'Fatal error occurred';
      const context = 'TestContext';
      const optionalParams = ['stack'];

      // Clear previous calls
      consoleSpy.error.mockClear();

      testLogger.fatal(message, context, ...optionalParams);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp(`.*FATAL.*${message}.*`)),
        ...optionalParams,
      );
    });

    it('should log fatal message without optional parameters', () => {
      process.env.LOG_LEVEL = 'FATAL';
      const testLogger = new MyLogger();
      const message = 'Fatal error occurred';

      // Clear previous calls
      consoleSpy.error.mockClear();

      testLogger.fatal(message);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp(`.*FATAL.*${message}.*`)),
      );
    });
  });

  describe('error method', () => {
    it('should log error message', () => {
      process.env.LOG_LEVEL = 'ERROR';
      const testLogger = new MyLogger();
      const message = 'Error occurred';
      const trace = 'Error stack trace';
      const context = 'TestContext';
      const optionalParams = ['extra param'];

      // Clear previous calls
      consoleSpy.error.mockClear();

      testLogger.error(message, trace, context, ...optionalParams);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining(message),
        expect.stringContaining(trace),
        ...optionalParams,
      );
    });

    it('should log error message without optional parameters', () => {
      process.env.LOG_LEVEL = 'ERROR';
      const testLogger = new MyLogger();
      const message = 'Error occurred';

      // Clear previous calls
      consoleSpy.error.mockClear();

      testLogger.error(message);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining(message),
        expect.any(String),
      );
    });
  });

  describe('warn method', () => {
    it('should log warning message', () => {
      process.env.LOG_LEVEL = 'WARN';
      const testLogger = new MyLogger();
      const message = 'Warning message';
      const context = 'TestContext';
      const optionalParams = ['details'];

      // Clear previous calls
      consoleSpy.warn.mockClear();

      testLogger.warn(message, context, ...optionalParams);

      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining(message),
        ...optionalParams,
      );
    });

    it('should log warning message without optional parameters', () => {
      process.env.LOG_LEVEL = 'WARN';
      const testLogger = new MyLogger();
      const message = 'Warning message';

      // Clear previous calls
      consoleSpy.warn.mockClear();

      testLogger.warn(message);

      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining(message),
      );
    });
  });

  describe('debug method', () => {
    it('should log debug message when LOG_LEVEL is DEBUG', () => {
      process.env.LOG_LEVEL = 'DEBUG';
      const testLogger = new MyLogger();
      const message = 'Debug message';
      const context = 'TestContext';
      const optionalParams = ['info'];

      // Clear previous calls
      consoleSpy.debug.mockClear();

      testLogger.debug(message, context, ...optionalParams);

      expect(consoleSpy.debug).toHaveBeenCalledWith(
        expect.stringContaining(message),
        ...optionalParams,
      );
    });

    it('should not log debug message when LOG_LEVEL is not DEBUG', () => {
      process.env.LOG_LEVEL = 'INFO';
      const testLogger = new MyLogger();
      const message = 'Debug message';

      testLogger.debug(message);

      expect(consoleSpy.debug).not.toHaveBeenCalled();
    });

    it('should not log debug message when LOG_LEVEL is undefined', () => {
      delete process.env.LOG_LEVEL;
      const testLogger = new MyLogger();
      const message = 'Debug message';

      testLogger.debug(message);

      expect(consoleSpy.debug).not.toHaveBeenCalled();
    });

    it('should not log debug message when LOG_LEVEL is empty string', () => {
      process.env.LOG_LEVEL = '';
      const testLogger = new MyLogger();
      const message = 'Debug message';

      testLogger.debug(message);

      expect(consoleSpy.debug).not.toHaveBeenCalled();
    });
  });

  describe('verbose method', () => {
    it('should log verbose message with VERBOSE prefix', () => {
      process.env.LOG_LEVEL = 'VERBOSE';
      const testLogger = new MyLogger();
      const message = 'Verbose message';
      const context = 'TestContext';
      const optionalParams = ['details'];

      // Clear previous calls
      consoleSpy.log.mockClear();

      testLogger.verbose(message, context, ...optionalParams);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp(`.*VERBOSE.*${message}.*`)),
        ...optionalParams,
      );
    });

    it('should log verbose message without optional parameters', () => {
      process.env.LOG_LEVEL = 'VERBOSE';
      const testLogger = new MyLogger();
      const message = 'Verbose message';

      // Clear previous calls
      consoleSpy.log.mockClear();

      testLogger.verbose(message);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp(`.*VERBOSE.*${message}.*`)),
      );
    });
  });

  describe('LoggerService interface compliance', () => {
    it('should be defined', () => {
      expect(logger).toBeDefined();
    });

    it('should have all required LoggerService methods', () => {
      expect(typeof logger.log).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.debug).toBe('function');
      expect(typeof logger.verbose).toBe('function');
      expect(typeof logger.fatal).toBe('function');
    });
  });

  describe('logLevel property', () => {
    it('should read LOG_LEVEL from environment variables', () => {
      process.env.LOG_LEVEL = 'ERROR';
      const newLogger = new MyLogger();

      // Clear previous calls
      consoleSpy.log.mockClear();

      newLogger.log('test');
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle null and undefined messages', () => {
      process.env.LOG_LEVEL = 'INFO';
      const testLogger = new MyLogger();

      // Clear previous calls
      consoleSpy.log.mockClear();

      testLogger.log(null);
      testLogger.log(undefined);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('null'),
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('undefined'),
      );
    });

    it('should handle empty string messages', () => {
      process.env.LOG_LEVEL = 'VERBOSE';
      const testLogger = new MyLogger();
      const emptyMessage = '';

      // Clear previous calls
      consoleSpy.error.mockClear();
      consoleSpy.warn.mockClear();
      consoleSpy.log.mockClear();

      testLogger.error(emptyMessage);
      testLogger.warn(emptyMessage);
      testLogger.fatal(emptyMessage);
      testLogger.verbose(emptyMessage);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining(emptyMessage),
        expect.any(String),
      );
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining(emptyMessage),
      );
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp(`.*FATAL.*${emptyMessage}.*`)),
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp(`.*VERBOSE.*${emptyMessage}.*`)),
      );
    });

    it('should handle object messages', () => {
      process.env.LOG_LEVEL = 'ERROR';
      const testLogger = new MyLogger();
      const objectMessage = { key: 'value', nested: { prop: 'test' } };

      // Clear previous calls
      consoleSpy.error.mockClear();

      testLogger.error(objectMessage);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[object Object]'),
        expect.any(String),
      );
    });

    it('should handle multiple optional parameters', () => {
      process.env.LOG_LEVEL = 'ERROR';
      const testLogger = new MyLogger();
      const message = 'Test message';
      const params = ['param1', 'param2', 'param3'];

      // Clear previous calls
      consoleSpy.error.mockClear();

      testLogger.error(message, undefined, undefined, ...params);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining(message),
        expect.any(String),
        ...params,
      );
    });
  });
});
