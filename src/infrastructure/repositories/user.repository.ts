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
      relations: ['employeeProfile', 'customerProfile', 'role'],
    });
    return user ? UserModel.fromEntity(user) : null;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['employeeProfile', 'customerProfile', 'role'],
    });
    return user ? UserModel.fromEntity(user) : null;
  }

  async create(
    userData: Partial<UserModel> & {
      fullName?: string;
      phone?: string;
      profilePicture?: string;
      age?: number;
      cityId?: number;
      department?: string;
      position?: string;
      acceptedTerms?: boolean;
    },
  ): Promise<UserModel> {
    const dbUserData = {
      email: userData.email,
      password_hash: userData.passwordHash,
      user_type: userData.userType,
      role_id: userData.roleId,
      deleted_at: null,
    };

    const newUser = this.userRepository.create(dbUserData);
    const savedUser = await this.userRepository.save(newUser);

    if (
      userData.userType === 'employee' &&
      (userData.fullName ||
        userData.phone ||
        userData.profilePicture ||
        userData.age ||
        userData.cityId ||
        userData.department ||
        userData.position)
    ) {
      const employeeProfile = this.userRepository.manager.create(
        'EmployeeProfile',
        {
          user_id: savedUser.id,
          full_name: userData.fullName,
          phone: userData.phone,
          profile_picture: userData.profilePicture,
          age: userData.age,
          city_id: userData.cityId,
          department: userData.department,
          position: userData.position,
          created_by: null,
        },
      );
      await this.userRepository.manager.save(employeeProfile);
    } else if (
      userData.userType === 'customer' &&
      (userData.fullName ||
        userData.phone ||
        userData.profilePicture ||
        userData.age ||
        userData.cityId ||
        userData.acceptedTerms !== undefined)
    ) {
      const customerProfile = this.userRepository.manager.create(
        'CustomerProfile',
        {
          user_id: savedUser.id,
          full_name: userData.fullName,
          phone: userData.phone,
          profile_picture: userData.profilePicture,
          age: userData.age,
          city_id: userData.cityId,
          accepted_terms: userData.acceptedTerms,
        },
      );
      await this.userRepository.manager.save(customerProfile);
    }

    // Reload the user with its relations
    const userWithProfile = await this.userRepository.findOne({
      where: { id: savedUser.id },
      relations: ['employeeProfile', 'customerProfile', 'role'],
    });

    return UserModel.fromEntity(userWithProfile);
  }

  async update(id: string, userData: Partial<UserModel>): Promise<UserModel> {
    const dbUserData: any = {};
    if (userData.email) dbUserData.email = userData.email;
    if (userData.passwordHash) dbUserData.password_hash = userData.passwordHash;
    if (userData.userType) dbUserData.user_type = userData.userType;
    if (userData.roleId !== undefined) dbUserData.role_id = userData.roleId;
    if (userData.fullName) dbUserData.full_name = userData.fullName;
    if (userData.phone) dbUserData.phone = userData.phone;
    if (userData.profilePicture)
      dbUserData.profile_picture = userData.profilePicture;

    await this.userRepository.update(id, dbUserData);
    const updatedUser = await this.userRepository.findOne({
      where: { id },
      relations: ['employeeProfile', 'customerProfile', 'role'],
    });
    return UserModel.fromEntity(updatedUser);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userRepository.update(id, {
      deleted_at: new Date(),
    });
    return (result.affected ?? 0) > 0;
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<UserModel | null> {
    const user = await this.userRepository.findOne({
      where: { email, deleted_at: null as any },
      relations: ['employeeProfile', 'customerProfile', 'role'],
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
