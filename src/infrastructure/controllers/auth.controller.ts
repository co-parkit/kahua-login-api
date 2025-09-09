import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { AuthRateLimitGuard } from '../guards/auth-rate-limit.guard';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { ForgotPasswordUseCase } from '../../application/use-cases/forgot-password.use-case';
import { LoginDto, ForgotPasswordDto } from '../../application/dtos/login.dto';
import { CreateUserDto } from '../../application/dtos/register.dto';
import {
  AuthResponseDto,
  UserCreateResponseDto,
} from '../../application/dtos/response.dto';
import { CurrentUser, LoginBody } from '../decorators';
import { UserModel } from '../../domain/models/user.model';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
  ) {}

  @UseGuards(AuthRateLimitGuard, AuthGuard('local'))
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @Post('login')
  @ApiOperation({ summary: 'Autenticación de usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @ApiResponse({
    status: 429,
    description:
      'Demasiados intentos de login. Intenta de nuevo en 60 segundos.',
  })
  async login(
    @CurrentUser() _user: UserModel,
    @LoginBody() loginDto: LoginDto,
  ): Promise<AuthResponseDto> {
    return await this.loginUseCase.execute(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registro de usuarios' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: UserCreateResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Usuario ya existe' })
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.registerUseCase.execute(createUserDto);
    return {
      userId: user.id,
      user: user.toPlainObject(),
    };
  }

  @UseGuards(AuthRateLimitGuard)
  @Throttle({ short: { limit: 3, ttl: 300000 } })
  @Post('forgot-password')
  @ApiOperation({ summary: 'Recuperar contraseña por correo' })
  @ApiResponse({ status: 200, description: 'Email de recuperación enviado' })
  @ApiResponse({ status: 400, description: 'Email no encontrado' })
  @ApiResponse({ status: 403, description: 'Rol no permitido' })
  @ApiResponse({
    status: 429,
    description:
      'Demasiadas solicitudes de recuperación. Intenta de nuevo en 5 minutos.',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.forgotPasswordUseCase.execute(forgotPasswordDto);
  }
}
