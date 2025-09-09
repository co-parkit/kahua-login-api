import { Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import {
  InvalidCredentialsException,
  InactiveUserException,
} from '../../domain/exceptions';

@Injectable()
export class LoginUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; user: any }> {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new InvalidCredentialsException();
    }

    if (!user.isActive()) {
      throw new InactiveUserException();
    }

    return await this.authService.generateJWT(user);
  }
}
