import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class MyLogger implements LoggerService {
  private readonly logLevel: string = process.env.LOG_LEVEL;

  log(message: any, ...optionalParams: any[]) {
    if (this.logLevel === 'INFO') {
      console.log(message, ...optionalParams);
    }
  }

  fatal(message: any, ...optionalParams: any[]) {
    console.error('FATAL', message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    if (this.logLevel === 'DEBUG') {
      console.debug(message, ...optionalParams);
    }
  }
  verbose?(message: any, ...optionalParams: any[]) {
    console.log('VERBOSE', message, ...optionalParams);
  }
}
