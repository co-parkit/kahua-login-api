import { HttpException, HttpStatus } from '@nestjs/common';
import { CODES } from '../../config/general.codes';

/**
 * Excepción para email ya registrado en pre-inscripción
 */
export class ParkingEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(
      {
        ...CODES.PKL_USER_EMAIL_EXIST,
        message: `Email ${email} is already registered for parking pre-enrollment`,
      },
      HttpStatus.CONFLICT,
    );
  }
}

/**
 * Excepción para reglas de negocio inválidas
 */
export class InvalidBusinessRuleException extends HttpException {
  constructor(message: string) {
    super(
      {
        ...CODES.PKL_BUSINESS_RULE_VIOLATION,
        message,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
