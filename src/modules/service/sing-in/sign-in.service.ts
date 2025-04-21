import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { Users } from '../../database/schema-user.db';
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
    @InjectModel(Users)
    private readonly usersModel: typeof Users,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  generateJWT(user: Users) {
    const { email, id, name, last_name, id_role, id_status } = user;
    const payload: PayloadToken = {
      email,
      sub: id,
      name,
      lastName: last_name,
      role: id_role,
      status: id_status,
    };
    const response: LoginUser = {
      id,
      name,
      last_name,
      email,
      id_role,
      id_status,
    };
    const secret = this.configService.get<string>(JwtSecretValue);
    const token = this.jwtService.sign(payload, { secret });
    return {
      access_token: token,
      user: response,
    };
  }

  findByEmail(email: string) {
    return this.usersModel.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<Response> {
    const user = await this.usersModel.findByPk<Users>(id);
    if (!user) {
      return new Response(CODES.PKL_DATA_NOT_FOUND);
    }
    return new Response(CODES.PKL_DATA_FOUND, user);
  }

  async validateUser(email: string, password: string): Promise<Users | null> {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        return null;
      }
      const isMatch = await bcrypt.compare(password, user.dataValues.password);
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
  ): Promise<Users | Response> {
    const user = await this.findByEmail(email);

    if (!user) return new Response(CODES.PKL_USER_NOT_FOUND);
    if (user.id_role !== UserPlatform)
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
    user: Users,
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
