import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../database/schema-user.db';
import { CODES } from '../../../config/general.codes';
import { Response } from '../../models/response.model';
import { MyLogger } from '../../../config/logger';

@Injectable()
export class SignUpService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly myLogger: MyLogger,
  ) {}

  async createUser(data: any): Promise<Response> {
    try {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(data.password, salt);

      const existingUser = await this.userRepository.findOne({
        where: [{ email: data.email }, { userName: data.user_name }],
      });

      if (existingUser) {
        if (existingUser.email === data.email) {
          return new Response(CODES.PKL_USER_EMAIL_EXIST);
        }
        if (existingUser.userName === data.user_name) {
          return new Response(CODES.PKL_USER_NAME_EXIST);
        }
      }

      const newUser = this.userRepository.create({
        ...data,
        password: hash,
      });

      const savedUser = await this.userRepository.save(newUser);

      return new Response(CODES.PKL_USER_CREATE_OK, { userId: savedUser });
    } catch (error) {
      this.myLogger.error('Error creating user', error.message);
      return new Response(CODES.PKL_GENERAL_ERROR);
    }
  }
}
