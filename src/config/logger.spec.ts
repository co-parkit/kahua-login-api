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

    Object.values(consoleSpy).forEach((spy) => spy.mockRestore());
  });

  describe('log method', () => {
    it('should log message when LOG_LEVEL is INFO', () => {
      process.env.LOG_LEVEL = 'INFO';
      const testLogger = new MyLogger();
      const message = 'Test log message';
      const optionalParams = ['param1', 'param2'];

      testLogger.log(message, ...optionalParams);

      expect(consoleSpy.log).toHaveBeenCalledWith(message, ...optionalParams);
    });

    it('should not log message when LOG_LEVEL is not INFO', () => {
      process.env.LOG_LEVEL = 'DEBUG';
      const testLogger = new MyLogger();
      const message = 'Test log message';

      testLogger.log(message);

      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it('should not log message when LOG_LEVEL is undefined', () => {
      delete process.env.LOG_LEVEL;
      const testLogger = new MyLogger();
      const message = 'Test log message';

      testLogger.log(message);

      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it('should not log message when LOG_LEVEL is empty string', () => {
      process.env.LOG_LEVEL = '';
      const testLogger = new MyLogger();
      const message = 'Test log message';

      testLogger.log(message);

      expect(consoleSpy.log).not.toHaveBeenCalled();
    });
  });

  describe('fatal method', () => {
    it('should log fatal message with FATAL prefix', () => {
      const message = 'Fatal error occurred';
      const optionalParams = ['error', 'stack'];

      logger.fatal(message, ...optionalParams);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        'FATAL',
        message,
        ...optionalParams,
      );
    });

    it('should log fatal message without optional parameters', () => {
      const message = 'Fatal error occurred';

      logger.fatal(message);

      expect(consoleSpy.error).toHaveBeenCalledWith('FATAL', message);
    });
  });

  describe('error method', () => {
    it('should log error message', () => {
      const message = 'Error occurred';
      const optionalParams = ['error', 'stack'];

      logger.error(message, ...optionalParams);

      expect(consoleSpy.error).toHaveBeenCalledWith(message, ...optionalParams);
    });

    it('should log error message without optional parameters', () => {
      const message = 'Error occurred';

      logger.error(message);

      expect(consoleSpy.error).toHaveBeenCalledWith(message);
    });
  });

  describe('warn method', () => {
    it('should log warning message', () => {
      const message = 'Warning message';
      const optionalParams = ['warning', 'details'];

      logger.warn(message, ...optionalParams);

      expect(consoleSpy.warn).toHaveBeenCalledWith(message, ...optionalParams);
    });

    it('should log warning message without optional parameters', () => {
      const message = 'Warning message';

      logger.warn(message);

      expect(consoleSpy.warn).toHaveBeenCalledWith(message);
    });
  });

  describe('debug method', () => {
    it('should log debug message when LOG_LEVEL is DEBUG', () => {
      process.env.LOG_LEVEL = 'DEBUG';
      const testLogger = new MyLogger();
      const message = 'Debug message';
      const optionalParams = ['debug', 'info'];

      testLogger.debug(message, ...optionalParams);

      expect(consoleSpy.debug).toHaveBeenCalledWith(message, ...optionalParams);
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
      const message = 'Verbose message';
      const optionalParams = ['verbose', 'details'];

      logger.verbose(message, ...optionalParams);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        'VERBOSE',
        message,
        ...optionalParams,
      );
    });

    it('should log verbose message without optional parameters', () => {
      const message = 'Verbose message';

      logger.verbose(message);

      expect(consoleSpy.log).toHaveBeenCalledWith('VERBOSE', message);
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
      process.env.LOG_LEVEL = 'TEST_LEVEL';
      const newLogger = new MyLogger();

      newLogger.log('test');
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle null and undefined messages', () => {
      process.env.LOG_LEVEL = 'INFO';
      const testLogger = new MyLogger();

      testLogger.log(null);
      testLogger.log(undefined);

      expect(consoleSpy.log).toHaveBeenCalledWith(null);
      expect(consoleSpy.log).toHaveBeenCalledWith(undefined);
    });

    it('should handle empty string messages', () => {
      const emptyMessage = '';

      logger.error(emptyMessage);
      logger.warn(emptyMessage);
      logger.fatal(emptyMessage);
      logger.verbose(emptyMessage);

      expect(consoleSpy.error).toHaveBeenCalledWith(emptyMessage);
      expect(consoleSpy.warn).toHaveBeenCalledWith(emptyMessage);
      expect(consoleSpy.error).toHaveBeenCalledWith('FATAL', emptyMessage);
      expect(consoleSpy.log).toHaveBeenCalledWith('VERBOSE', emptyMessage);
    });

    it('should handle object messages', () => {
      const objectMessage = { key: 'value', nested: { prop: 'test' } };

      logger.error(objectMessage);

      expect(consoleSpy.error).toHaveBeenCalledWith(objectMessage);
    });

    it('should handle multiple optional parameters', () => {
      const message = 'Test message';
      const params = ['param1', 'param2', 'param3', { obj: 'value' }];

      logger.error(message, ...params);

      expect(consoleSpy.error).toHaveBeenCalledWith(message, ...params);
    });
  });
});
