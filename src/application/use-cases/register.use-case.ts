import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UserModel } from '../../domain/models/user.model';
import { RegisterDto } from '../dtos/register.dto';
import { EmailAlreadyExistsException } from '../../domain/exceptions';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(registerDto: RegisterDto): Promise<UserModel> {
    const existingUser = await this.userRepository.findByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new EmailAlreadyExistsException(registerDto.email);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    // Construct the full name if name and last_name are provided
    const fullName =
      registerDto.full_name ||
      (registerDto.name && registerDto.last_name
        ? `${registerDto.name} ${registerDto.last_name}`
        : registerDto.name || registerDto.last_name);

    const userData = {
      email: registerDto.email,
      passwordHash: hashedPassword,
      userType: registerDto.user_type,
      roleId: registerDto.role_id || registerDto.id_role || null,
      // Profile data
      fullName: fullName,
      phone: registerDto.phone,
      profilePicture: registerDto.profile_picture,
      age: registerDto.age,
      cityId: registerDto.city_id,
      // Specific data according to the user type
      ...(registerDto.user_type === 'employee' && {
        department: registerDto.department,
        position: registerDto.position,
      }),
      ...(registerDto.user_type === 'customer' && {
        acceptedTerms: registerDto.accepted_terms,
      }),
    };

    return await this.userRepository.create(userData);
  }
}
