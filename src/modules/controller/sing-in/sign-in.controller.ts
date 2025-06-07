import { Controller, Body, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '../../database/schema-user.db';
import { SignInService } from '../../service/sing-in/sign-in.service';
import { ForgotPasswordDto } from '../../../modules/dto/forgot-password-dto';

@ApiTags('sign-in')
@Controller('sign-in')
export class SignInController {
  constructor(private readonly signInService: SignInService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Auth of users' })
  async login(@Req() payload: Request) {
    const user = payload.user as User;
    return this.signInService.generateJWT(user);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Recuperar contraseña por correo' })
  async forgotPassword(@Body() payload: ForgotPasswordDto) {
    return this.signInService.forgotPassword(payload.email);
  }
}
