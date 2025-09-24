import { HttpException, HttpStatus } from '@nestjs/common';
import { CODES } from '../../config/general.codes';

/**
 * Base exception for all domain exceptions
 * Provides a unified error handling
 */
export class BaseDomainException extends HttpException {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly statusCode: HttpStatus,
    public readonly details?: any,
  ) {
    super(
      {
        code,
        message,
        details,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }

  /**
   * Create an exception from a predefined code
   */
  static fromCode(
    code: keyof typeof CODES,
    details?: any,
  ): BaseDomainException {
    const codeData = CODES[code];
    return new BaseDomainException(
      codeData.code,
      codeData.message,
      codeData.status || HttpStatus.BAD_REQUEST,
      details,
    );
  }

  /**
   * Create a custom exception
   */
  static custom(
    code: string,
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: any,
  ): BaseDomainException {
    return new BaseDomainException(code, message, statusCode, details);
  }
}
