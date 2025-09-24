import { HttpStatus } from '@nestjs/common';
import { BaseDomainException } from './base.exception';

/**
 * Exception for invalid credentials
 */
export class InvalidCredentialsException extends BaseDomainException {
  constructor() {
    super(
      'PKL_USER_NOT_FOUND',
      'Invalid email or password',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

/**
 * Exception for inactive user
 */
export class InactiveUserException extends BaseDomainException {
  constructor() {
    super(
      'PKL_ROLE_NOT_ALLOWED',
      'Contact your administrator to change your password.',
      HttpStatus.FORBIDDEN,
    );
  }
}

/**
 * Exception for email already registered
 */
export class EmailAlreadyExistsException extends BaseDomainException {
  constructor(email: string) {
    super(
      'PKL_USER_EMAIL_EXIST',
      `Email ${email} is already registered`,
      HttpStatus.CONFLICT,
      { email },
    );
  }
}

/**
 * Exception for username already in use
 */
export class UsernameAlreadyExistsException extends BaseDomainException {
  constructor(username: string) {
    super(
      'PKL_USER_NAME_EXIST',
      `Username ${username} is already in use`,
      HttpStatus.CONFLICT,
      { username },
    );
  }
}
