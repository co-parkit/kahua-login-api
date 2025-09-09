import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { IAuthService } from '../../domain/interfaces/auth.service.interface';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UserModel } from '../../domain/models/user.model';
import { CODES } from '../../config/general.codes';
import {
  API_ENDPOINTS,
  EMAIL_SENT,
  JWT_EXPIRES_IN_RESET,
  JWT_SECRET_KEY,
  USER_PLATFORM,
} from '../../config/constants';
import { MyLogger } from '../../config/logger';
import { Response } from '../../domain/models/response.model';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly logger: MyLogger,
  ) {}

  async generateJWT(
    user: UserModel,
  ): Promise<{ access_token: string; user: any }> {
    const payload = {
      email: user.email,
      sub: user.id,
      name: user.name,
      lastName: user.lastName,
      role: user.idRole,
      status: user.idStatus,
    };

    const secret = this.configService.get<string>(JWT_SECRET_KEY);
    const token = this.jwtService.sign(payload, { secret });

    return {
      access_token: token,
      user: user.toPlainObject(),
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserModel | null> {
    try {
      return await this.userRepository.validateCredentials(email, password);
    } catch (error) {
      this.logger.error('Error validating user', error.message);
      return null;
    }
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    return await this.userRepository.findByEmail(email);
  }

  async findUserById(id: number): Promise<UserModel | null> {
    return await this.userRepository.findById(id);
  }

  async forgotPassword(email: string): Promise<Response> {
    const user = await this.validateUserForPasswordReset(email);
    if (user instanceof Response) return user;

    const resetUrl = this.buildResetUrl(user.id);
    return this.sendPasswordResetEmail(user, resetUrl);
  }

  private async validateUserForPasswordReset(
    email: string,
  ): Promise<UserModel | Response> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) return new Response(CODES.PKL_USER_NOT_FOUND);
    if (!user.hasRole(USER_PLATFORM))
      return new Response(CODES.PKL_ROLE_NOT_ALLOWED);

    return user;
  }

  private buildResetUrl(userId: number): string {
    const token = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get<string>(JWT_SECRET_KEY),
        expiresIn: JWT_EXPIRES_IN_RESET,
      },
    );
    return `${this.configService.get(
      'FRONTEND_URL',
    )}/reset-password?token=${token}`;
  }

  private async sendPasswordResetEmail(
    user: UserModel,
    resetUrl: string,
  ): Promise<Response> {
    try {
      const apiUrl = this.configService.get<string>(
        'config.getApi.kahuaNotification',
      );

      const response = await lastValueFrom(
        this.httpService.post(`${apiUrl}${API_ENDPOINTS.EMAIL_SEND_RESET}`, {
          to: user.email,
          templateName: EMAIL_SENT.TEMPLATE_RESET,
          variables: {
            name: user.name,
            action: EMAIL_SENT.ACTION_RESET,
            resetUrl,
          },
        }),
      );

      if (response.status === 201) {
        return new Response(CODES.KHL_EMAIL_SENT);
      }

      return new Response(CODES.KHL_NOTIFICATION_FAILED, response.data);
    } catch (error) {
      return new Response(CODES.KHL_NOTIFICATION_FAILED, {
        error: error?.response?.data ?? CODES.KHL_NOTIFICATION_FAILED,
      });
    }
  }
}
