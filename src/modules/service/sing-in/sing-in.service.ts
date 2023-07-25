import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Users } from '../../database/schema.db';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SingInService {
  constructor(
    @InjectModel(Users)
    private usersModel: typeof Users,
  ) {}

  async findAll(): Promise<Users[]> {
    return this.usersModel.findAll<Users>();
  }

  async findUserById(id: number): Promise<Users> {
    const user = await this.usersModel.findByPk<Users>(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async updateData(id: number, data: any): Promise<Users> {
    const user = await this.findUserById(id);
    let updateData;
    if (data.password) {
      const isMatch = await bcrypt.compare(data.password, user.password);
      if (isMatch) {
        throw new HttpException(
          'The new password must be different from the current password',
          HttpStatus.BAD_REQUEST,
        );
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
