import { Injectable } from '@nestjs/common';
import { Users } from '../../database/schema.db';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { CODES } from '../../../config/general.codes';
import { Response } from '../../models/response.model';
@Injectable()
export class SingUpService {
  constructor(
    @InjectModel(Users)
    private usersModel: typeof Users,
  ) { }
  async createUser(data: any): Promise<Response> {
    const salt = await bcrypt.genSalt();
    const password = data.password;
    const hash = await bcrypt.hash(password, salt);
    const newUser = {
      ...data,
      password: hash,
    };
    const responseData = {
      email: data.email,
      password: hash,
    };
    // eslint-disable-next-line prettier/prettier
    const existingEmail = await this.usersModel.findOne({ where: { email: data.email } });

    // eslint-disable-next-line prettier/prettier
    const existingUserName = await this.usersModel.findOne({ where: { user_name: data.user_name } });
    if (existingEmail) {
      return new Response(CODES.PKL_USER_EMAIL_EXIST, null);
    }
    if (existingUserName) {
      return new Response(CODES.PKL_USER_NAME_EXIST, null);
    }
    if (existingEmail) {
      return new Response(CODES.PKL_USER_EMAIL_EXIST, null);
    }
    this.usersModel.create(newUser);
    return new Response(CODES.PKL_USER_CREATE_OK, responseData);
  }
}
