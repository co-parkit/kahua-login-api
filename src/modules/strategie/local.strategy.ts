import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { SignInService } from '../service/sing-in/sign-in.service';
import { Strategy } from 'passport-local';
import { CODES } from '../../config/general.codes';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: SignInService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException(CODES.PKL_USER_NOT_FOUND);
    }
    return user;
  }
}
