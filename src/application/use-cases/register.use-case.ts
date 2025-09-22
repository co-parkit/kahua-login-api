import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UserModel } from '../../domain/models/user.model';
import { CreateUserDto } from '../dtos/register.dto';
import { EmailAlreadyExistsException } from '../../domain/exceptions';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(createUserDto: CreateUserDto): Promise<UserModel> {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new EmailAlreadyExistsException(createUserDto.email);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const userData = {
      email: createUserDto.email,
      password_hash: hashedPassword,
      user_type: createUserDto.user_type,
      role_id: createUserDto.role_id || null,
    };

    return await this.userRepository.create(userData);
  }
}
