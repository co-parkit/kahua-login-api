import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';
import { UserModel } from '../../domain/models/user.model';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<UserModel | null> {
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations: ['employeeProfile', 'customerProfile', 'role']
    });
    return user ? UserModel.fromEntity(user) : null;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const user = await this.userRepository.findOne({ 
      where: { email },
      relations: ['employeeProfile', 'customerProfile', 'role']
    });
    return user ? UserModel.fromEntity(user) : null;
  }

  async findByUserName(userName: string): Promise<UserModel | null> {
    // En la nueva estructura no hay userName, solo email
    return null;
  }

  async findByEmailOrUserName(
    email: string,
    userName: string,
  ): Promise<UserModel | null> {
    // En la nueva estructura solo buscamos por email
    return this.findByEmail(email);
  }

  async create(userData: Partial<UserModel>): Promise<UserModel> {
    const newUser = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(newUser);
    return UserModel.fromEntity(savedUser);
  }

  async update(id: string, userData: Partial<UserModel>): Promise<UserModel> {
    await this.userRepository.update(id, userData);
    const updatedUser = await this.userRepository.findOne({ 
      where: { id },
      relations: ['employeeProfile', 'customerProfile', 'role']
    });
    return UserModel.fromEntity(updatedUser);
  }

  async delete(id: string): Promise<boolean> {
    // Soft delete - actualizar deleted_at
    const result = await this.userRepository.update(id, { 
      deleted_at: new Date() 
    });
    return result.affected > 0;
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<UserModel | null> {
    const user = await this.userRepository.findOne({ 
      where: { email, deleted_at: null },
      relations: ['employeeProfile', 'customerProfile', 'role']
    });

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return null;
    }

    return UserModel.fromEntity(user);
  }
}
