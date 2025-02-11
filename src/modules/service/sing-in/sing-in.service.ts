import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Users } from '../../database/schema-user.db';
import { PayloadToken, LoginUser } from '../../models/token.model';
import { ConfigService } from '@nestjs/config';
import { CODES } from '../../../config/general.codes';
import { Response } from '../../models/response.model';
@Injectable()
export class SignInService {
  constructor(
    @InjectModel(Users)
    private readonly usersModel: typeof Users,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
    const secret = this.configService.get<string>('jwtSecret');
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

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return user;
      }
    }
    return null;
  }

  async updateData(id: number, data: any): Promise<Response> {
    const user = await this.findUserById(id);
    let updateData;
    if (data.password) {
      const isMatch = await bcrypt.compare(data.password, user.data.password);
      if (isMatch) {
        return new Response(CODES.PKL_BAD_REQUEST);
      }
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(data.password, salt);
      updateData = {
        ...data,
        password: hash,
      };
    }
    Object.assign(user, updateData);
    await user.save();
    return user;
  }
}
