import { Injectable } from '@nestjs/common';
import { Users } from '../../database/schema.db';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SingUpService {
  constructor(
    @InjectModel(Users)
    private usersModel: typeof Users,
  ) {}

  async createUser(data: any): Promise<Users> {
    const salt = await bcrypt.genSalt();
    const password = data.password;
    const hash = await bcrypt.hash(password, salt);
    const newUser = {
      ...data,
      password: hash,
    };
    return this.usersModel.create(newUser);
  }
}
