import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Users } from '../../database/schema.db';
import { PayloadToken } from '../../models/token.model';
@Injectable()
export class SingInService {
  constructor(
    @InjectModel(Users)
    private usersModel: typeof Users,
    private jwtService: JwtService,
  ) {}

  generateJWT(user: Users) {
    const payload: PayloadToken = {
      email: user.email,
      sub: user.id,
      name: user.name,
      lastName: user.last_name,
      role: user.id_role,
      status: user.id_status,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  findByEmail(email: string) {
    return this.usersModel.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<Users> {
    const user = await this.usersModel.findByPk<Users>(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
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
