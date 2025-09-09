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

  async findById(id: number): Promise<UserModel | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user ? UserModel.fromEntity(user) : null;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ? UserModel.fromEntity(user) : null;
  }

  async findByUserName(userName: string): Promise<UserModel | null> {
    const user = await this.userRepository.findOne({ where: { userName } });
    return user ? UserModel.fromEntity(user) : null;
  }

  async findByEmailOrUserName(
    email: string,
    userName: string,
  ): Promise<UserModel | null> {
    const user = await this.userRepository.findOne({
      where: [{ email }, { userName }],
    });
    return user ? UserModel.fromEntity(user) : null;
  }

  async create(userData: Partial<UserModel>): Promise<UserModel> {
    const newUser = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(newUser);
    return UserModel.fromEntity(savedUser);
  }

  async update(id: number, userData: Partial<UserModel>): Promise<UserModel> {
    await this.userRepository.update(id, userData);
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    return UserModel.fromEntity(updatedUser);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<UserModel | null> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    return UserModel.fromEntity(user);
  }
}
