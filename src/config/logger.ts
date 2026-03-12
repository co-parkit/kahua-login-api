import { Injectable, LoggerService } from '@nestjs/common';

export enum LogLevels {
  FATAL = 0,
  ERROR = 1,
  WARN = 2,
  LOG = 3,
  DEBUG = 4,
  VERBOSE = 5,
}

@Injectable()
export class MyLogger implements LoggerService {
  private readonly logLevel: LogLevels;
  private readonly context?: string;

  constructor(context?: string) {
    this.context = context;
    const envLogLevel = process.env.LOG_LEVEL?.toUpperCase() ?? 'LOG';
    this.logLevel =
      LogLevels[envLogLevel as keyof typeof LogLevels] ?? LogLevels.LOG;
  }

  private shouldLog(level: LogLevels): boolean {
    return level <= this.logLevel;
  }

  private formatMessage(level: string, message: any, context?: string): string {
    const timestamp = new Date().toISOString();
    const contextStr = context || this.context || 'Application';
    return `[${timestamp}] [${level}] [${contextStr}] ${message}`;
  }

  log(message: any, context?: string, ...optionalParams: any[]) {
    if (this.shouldLog(LogLevels.LOG)) {
      const formattedMessage = this.formatMessage('LOG', message, context);
      console.log(formattedMessage, ...optionalParams);
    }
  }

  error(
    message: any,
    trace?: string,
    context?: string,
    ...optionalParams: any[]
  ) {
    if (this.shouldLog(LogLevels.ERROR)) {
      const formattedMessage = this.formatMessage('ERROR', message, context);
      console.error(
        formattedMessage,
        trace ? `\n${trace}` : '',
        ...optionalParams,
      );
    }
  }

  warn(message: any, context?: string, ...optionalParams: any[]) {
    if (this.shouldLog(LogLevels.WARN)) {
      const formattedMessage = this.formatMessage('WARN', message, context);
      console.warn(formattedMessage, ...optionalParams);
    }
  }

  debug(message: any, context?: string, ...optionalParams: any[]) {
    if (this.shouldLog(LogLevels.DEBUG)) {
      const formattedMessage = this.formatMessage('DEBUG', message, context);
      console.debug(formattedMessage, ...optionalParams);
    }
  }

  verbose(message: any, context?: string, ...optionalParams: any[]) {
    if (this.shouldLog(LogLevels.VERBOSE)) {
      const formattedMessage = this.formatMessage('VERBOSE', message, context);
      console.log(formattedMessage, ...optionalParams);
    }
  }

  fatal(message: any, context?: string, ...optionalParams: any[]) {
    if (this.shouldLog(LogLevels.FATAL)) {
      const formattedMessage = this.formatMessage('FATAL', message, context);
      console.error(formattedMessage, ...optionalParams);
    }
  }
}
