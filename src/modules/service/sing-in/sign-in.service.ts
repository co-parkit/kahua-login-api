import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../../database/schema-user.db';
import { PayloadToken, LoginUser } from '../../models/token.model';
import { CODES } from '../../../config/general.codes';
import { Response } from '../../models/response.model';
import {
  API_ENDPOINTS,
  EMAIL_SENT,
  ExpiresInReset,
  JwtSecretValue,
  UserPlatform,
} from '../../../config/constants';

@Injectable()
export class SignInService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  generateJWT(user: User) {
    const { email, id, name, lastName, idRole, idStatus } = user;
    const payload: PayloadToken = {
      email,
      sub: id,
      name,
      lastName,
      role: idRole,
      status: idStatus,
    };
    const response: LoginUser = {
      id,
      name,
      lastName: lastName,
      email,
      idRole: idRole,
      idStatus: idStatus,
    };
    const secret = this.configService.get<string>(JwtSecretValue);
    const token = this.jwtService.sign(payload, { secret });
    return {
      access_token: token,
      user: response,
    };
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findUserById(id: number): Promise<Response> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return new Response(CODES.PKL_DATA_NOT_FOUND);
    }
    return new Response(CODES.PKL_DATA_FOUND, user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        return null;
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return null;
      }
      return user;
    } catch (error) {
      return error;
    }
  }

  async forgotPassword(email: string): Promise<Response> {
    const user = await this.validateUserForPasswordReset(email);
    if (user instanceof Response) return user;

    const resetUrl = this.buildResetUrl(user.id);
    return this.sendPasswordResetEmail(user, resetUrl);
  }

  private async validateUserForPasswordReset(
    email: string,
  ): Promise<User | Response> {
    const user = await this.findByEmail(email);

    if (!user) return new Response(CODES.PKL_USER_NOT_FOUND);
    if (user.idRole !== UserPlatform)
      return new Response(CODES.PKL_ROLE_NOT_ALLOWED);

    return user;
  }

  private buildResetUrl(userId: number): string {
    const token = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get<string>(JwtSecretValue),
        expiresIn: ExpiresInReset,
      },
    );
    return `${this.configService.get(
      'FRONTEND_URL',
    )}/reset-password?token=${token}`;
  }

  async sendPasswordResetEmail(
    user: User,
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
