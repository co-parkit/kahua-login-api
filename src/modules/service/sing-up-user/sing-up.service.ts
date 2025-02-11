import { Injectable } from '@nestjs/common';
import { Users } from '../../database/schema-user.db';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { CODES } from '../../../config/general.codes';
import { Response } from '../../models/response.model';

@Injectable()
export class SingUpService {
  constructor(
    @InjectModel(Users)
    private readonly usersModel: typeof Users,
  ) {}

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
    this.usersModel.create(newUser);
    return new Response(CODES.PKL_USER_CREATE_OK, responseData);
  }
}
