import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UserModel } from '../../domain/models/user.model';
import { CreateUserDto } from '../dtos/register.dto';
import {
  EmailAlreadyExistsException,
  UsernameAlreadyExistsException,
} from '../../domain/exceptions';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(createUserDto: CreateUserDto): Promise<UserModel> {
    const existingUser = await this.userRepository.findByEmailOrUserName(
      createUserDto.email,
      createUserDto.userName,
    );

    if (existingUser) {
      if (existingUser.email === createUserDto.email) {
        throw new EmailAlreadyExistsException(createUserDto.email);
      }
      if (existingUser.userName === createUserDto.userName) {
        throw new UsernameAlreadyExistsException(createUserDto.userName);
      }
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const userData = {
      name: createUserDto.name,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      phone: createUserDto.phone,
      userName: createUserDto.userName,
      password: hashedPassword,
      idRole: createUserDto.idRole,
      idStatus: 1,
    };

    return await this.userRepository.create(userData);
  }
}
