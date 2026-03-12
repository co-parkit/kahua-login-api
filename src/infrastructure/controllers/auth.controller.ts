import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { AuthRateLimitGuard } from '../guards/auth-rate-limit.guard';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { ForgotPasswordUseCase } from '../../application/use-cases/forgot-password.use-case';
import { LoginDto, ForgotPasswordDto } from '../../application/dtos/login.dto';
import { RegisterDto } from '../../application/dtos/register.dto';
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
  @ApiOperation({ summary: 'Authentication of users' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({
    status: 429,
    description: 'Too many login attempts. Try again in 60 seconds.',
  })
  async login(
    @CurrentUser() _user: UserModel,
    @LoginBody() loginDto: LoginDto,
  ): Promise<AuthResponseDto> {
    return await this.loginUseCase.execute(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register users' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserCreateResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Data invalid' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.registerUseCase.execute(registerDto);
    return {
      success: true,
      message: 'User created successfully',
      data: {
        userId: user.id,
        user: user.toPlainObject(),
      },
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(AuthRateLimitGuard)
  @Throttle({ short: { limit: 3, ttl: 300000 } })
  @Post('forgot-password')
  @ApiOperation({ summary: 'Recover password by email' })
  @ApiResponse({ status: 200, description: 'Email recovery sent' })
  @ApiResponse({ status: 400, description: 'Email not found' })
  @ApiResponse({ status: 403, description: 'Role not allowed' })
  @ApiResponse({
    status: 429,
    description: 'Too many recovery requests. Try again in 5 minutes.',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const result = await this.forgotPasswordUseCase.execute(forgotPasswordDto);
    return {
      success: true,
      message: 'Password reset email sent successfully',
      data: result,
      timestamp: new Date().toISOString(),
    };
  }
}
