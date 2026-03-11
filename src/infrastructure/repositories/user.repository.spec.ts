import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserModel } from '../../domain/models/user.model';
import { mockUserEntity } from '../../../test/mocks/user/user-entity.mock';
import { mockCreatedUser } from '../../../test/mocks/user/user.mock';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UserRepository', () => {
  let repository: UserRepository;
  let typeOrmRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const mockTypeOrmRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    typeOrmRepository = module.get(getRepositoryToken(User));

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      typeOrmRepository.findOne.mockResolvedValue(mockUserEntity);

      const result = await repository.findById('1');

      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['employeeProfile', 'customerProfile', 'role'],
      });
      expect(result).toEqual(mockCreatedUser);
    });

    it('should return null when user not found by id', async () => {
      typeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('999');

      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: '999' },
        relations: ['employeeProfile', 'customerProfile', 'role'],
      });
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      typeOrmRepository.findOne.mockRejectedValue(error);

      await expect(repository.findById('1')).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      typeOrmRepository.findOne.mockResolvedValue(mockUserEntity);

      const result = await repository.findByEmail('john.doe@test.com');

      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'john.doe@test.com' },
        relations: ['employeeProfile', 'customerProfile', 'role'],
      });
      expect(result).toEqual(mockCreatedUser);
    });

    it('should return null when user not found by email', async () => {
      typeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findByEmail('nonexistent@test.com');

      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@test.com' },
        relations: ['employeeProfile', 'customerProfile', 'role'],
      });
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      typeOrmRepository.findOne.mockRejectedValue(error);

      await expect(repository.findByEmail('test@test.com')).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('create', () => {
    it('should create new user', async () => {
      const userData = {
        email: 'jane.smith@test.com',
        passwordHash: 'hashedPassword123',
        userType: 'employee' as const,
        roleId: 1,
      };

      const createdEntity = {
        ...mockUserEntity,
        email: userData.email,
        password_hash: userData.passwordHash,
        user_type: userData.userType,
        role_id: userData.roleId,
      };
      typeOrmRepository.create.mockReturnValue(createdEntity as any);
      typeOrmRepository.save.mockResolvedValue(createdEntity);
      typeOrmRepository.findOne.mockResolvedValue(createdEntity);

      const result = await repository.create(userData);

      expect(typeOrmRepository.create).toHaveBeenCalledWith({
        email: userData.email,
        password_hash: userData.passwordHash,
        user_type: userData.userType,
        role_id: userData.roleId,
        deleted_at: null,
      });
      expect(typeOrmRepository.save).toHaveBeenCalledWith(createdEntity);
      expect(result).toEqual(UserModel.fromEntity(createdEntity));
    });

    it('should handle database errors during creation', async () => {
      const userData = {
        name: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@test.com',
        userName: 'janesmith',
        password: 'password123',
        idRole: 1,
        idStatus: 1,
      };

      const error = new Error('Database constraint violation');
      typeOrmRepository.create.mockReturnValue(userData as any);
      typeOrmRepository.save.mockRejectedValue(error);

      await expect(repository.create(userData)).rejects.toThrow(
        'Database constraint violation',
      );
    });
  });

  describe('update', () => {
    it('should update existing user', async () => {
      const updateData = { fullName: 'John Updated' };
      const updatedEntity = { ...mockUserEntity, ...updateData };

      typeOrmRepository.update.mockResolvedValue({ affected: 1 } as any);
      typeOrmRepository.findOne.mockResolvedValue(updatedEntity);

      const result = await repository.update('1', updateData);

      expect(typeOrmRepository.update).toHaveBeenCalledWith('1', {
        full_name: updateData.fullName,
      });
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['employeeProfile', 'customerProfile', 'role'],
      });
      expect(result).toEqual(UserModel.fromEntity(updatedEntity));
    });

    it('should handle database errors during update', async () => {
      const updateData = { fullName: 'John Updated' };
      const error = new Error('Database connection failed');

      typeOrmRepository.update.mockRejectedValue(error);

      await expect(repository.update('1', updateData)).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should handle case when user is not found after update', async () => {
      const updateData = { fullName: 'John Updated' };

      typeOrmRepository.update.mockResolvedValue({ affected: 0 } as any);
      typeOrmRepository.findOne.mockResolvedValue(null);

      await expect(repository.update('999', updateData)).rejects.toThrow(
        'Cannot read properties of null',
      );
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      typeOrmRepository.update.mockResolvedValue({ affected: 1 } as any);

      const result = await repository.delete('1');

      expect(typeOrmRepository.update).toHaveBeenCalledWith('1', {
        deleted_at: expect.any(Date),
      });
      expect(result).toBe(true);
    });

    it('should return false when no user was deleted', async () => {
      typeOrmRepository.update.mockResolvedValue({ affected: 0 } as any);

      const result = await repository.delete('999');

      expect(typeOrmRepository.update).toHaveBeenCalledWith('999', {
        deleted_at: expect.any(Date),
      });
      expect(result).toBe(false);
    });

    it('should handle database errors during deletion', async () => {
      const error = new Error('Database connection failed');
      typeOrmRepository.update.mockRejectedValue(error);

      await expect(repository.delete('1')).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('validateCredentials', () => {
    it('should validate credentials correctly', async () => {
      const email = 'john.doe@test.com';
      const password = 'password123';

      typeOrmRepository.findOne.mockResolvedValue(mockUserEntity);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await repository.validateCredentials(email, password);

      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email, deleted_at: null as any },
        relations: ['employeeProfile', 'customerProfile', 'role'],
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUserEntity.password_hash,
      );
      expect(result).toEqual(mockCreatedUser);
    });

    it('should return null when user is not found', async () => {
      const email = 'nonexistent@test.com';
      const password = 'password123';

      typeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.validateCredentials(email, password);

      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email, deleted_at: null as any },
        relations: ['employeeProfile', 'customerProfile', 'role'],
      });
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when password does not match', async () => {
      const email = 'john.doe@test.com';
      const password = 'wrongpassword';

      typeOrmRepository.findOne.mockResolvedValue(mockUserEntity);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await repository.validateCredentials(email, password);

      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email, deleted_at: null as any },
        relations: ['employeeProfile', 'customerProfile', 'role'],
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUserEntity.password_hash,
      );
      expect(result).toBeNull();
    });

    it('should handle database errors during validation', async () => {
      const email = 'john.doe@test.com';
      const password = 'password123';
      const error = new Error('Database connection failed');

      typeOrmRepository.findOne.mockRejectedValue(error);

      await expect(
        repository.validateCredentials(email, password),
      ).rejects.toThrow('Database connection failed');
    });

    it('should handle bcrypt errors during validation', async () => {
      const email = 'john.doe@test.com';
      const password = 'password123';
      const error = new Error('Bcrypt error');

      typeOrmRepository.findOne.mockResolvedValue(mockUserEntity);
      (mockedBcrypt.compare as jest.Mock).mockRejectedValue(error);

      await expect(
        repository.validateCredentials(email, password),
      ).rejects.toThrow('Bcrypt error');
    });
  });

  describe('UserModel conversion', () => {
    it('should convert entity to UserModel correctly', async () => {
      typeOrmRepository.findOne.mockResolvedValue(mockUserEntity);

      const result = await repository.findById('1');

      expect(result).toBeInstanceOf(UserModel);
      expect(result?.id).toBe(mockUserEntity.id);
      expect(result?.fullName).toBeUndefined();
      expect(result?.email).toBe(mockUserEntity.email);
      expect(result?.email).toBe(mockUserEntity.email);
      expect(result?.userType).toBe(mockUserEntity.user_type);
      expect(result?.roleId).toBe(mockUserEntity.role_id);
    });
  });

  describe('Edge cases', () => {
    it('should handle null values gracefully', async () => {
      typeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById(null as any);

      expect(result).toBeNull();
    });

    it('should handle undefined values gracefully', async () => {
      typeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findByEmail(undefined as any);

      expect(result).toBeNull();
    });
  });
});
