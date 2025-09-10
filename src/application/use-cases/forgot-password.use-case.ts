import { Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ForgotPasswordDto } from '../dtos/login.dto';

/**
 * Caso de uso para recuperación de contraseña
 * Contiene la lógica de negocio para el envío de email de recuperación
 */
@Injectable()
export class ForgotPasswordUseCase {
  constructor(private readonly authService: AuthService) {}

  /**
   * Ejecuta el proceso de recuperación de contraseña
   */
  async execute(forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto.email);
  }
}
