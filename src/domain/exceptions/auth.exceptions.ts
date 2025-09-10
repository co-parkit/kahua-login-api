import { HttpException, HttpStatus } from '@nestjs/common';
import { CODES } from '../../config/general.codes';

/**
 * Excepción para credenciales inválidas
 */
export class InvalidCredentialsException extends HttpException {
  constructor() {
    super(CODES.PKL_USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
  }
}

/**
 * Excepción para usuario inactivo
 */
export class InactiveUserException extends HttpException {
  constructor() {
    super(CODES.PKL_ROLE_NOT_ALLOWED, HttpStatus.FORBIDDEN);
  }
}

/**
 * Excepción para email ya registrado
 */
export class EmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(
      {
        ...CODES.PKL_USER_EMAIL_EXIST,
        message: `Email ${email} is already registered`,
      },
      HttpStatus.CONFLICT,
    );
  }
}

/**
 * Excepción para nombre de usuario ya en uso
 */
export class UsernameAlreadyExistsException extends HttpException {
  constructor(username: string) {
    super(
      {
        ...CODES.PKL_USER_NAME_EXIST,
        message: `Username ${username} is already in use`,
      },
      HttpStatus.CONFLICT,
    );
  }
}
