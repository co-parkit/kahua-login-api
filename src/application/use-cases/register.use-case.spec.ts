import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUseCase } from './register.use-case';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import {
  EmailAlreadyExistsException,
  UsernameAlreadyExistsException,
} from '../../domain/exceptions';
import * as bcrypt from 'bcrypt';
import {
  mockCreatedUser,
  mockExistingUser,
  mockExistingUserWithSameEmail,
  mockExistingUserWithSameUsername,
} from '../../../test/mocks/user/user.mock';
import { mockCreateUserDto } from '../../../test/mocks/user/register-dto.mock';
import {
  createMockUserRepository,
  MockUserRepository,
} from '../../../test/mocks/repositories/user-repository.mock';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
  let userRepository: MockUserRepository;

  beforeEach(async () => {
    const mockUserRepository = createMockUserRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUseCase,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<RegisterUseCase>(RegisterUseCase);
    userRepository = module.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setupSuccessfulRegistration = () => {
    userRepository.findByEmailOrUserName.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(mockCreatedUser);
    mockedBcrypt.genSalt.mockResolvedValue('salt123' as never);
    mockedBcrypt.hash.mockResolvedValue('hashedPassword123' as never);
  };

  const setupBcryptError = (error: Error) => {
    userRepository.findByEmailOrUserName.mockResolvedValue(null);
    mockedBcrypt.genSalt.mockImplementation(() => Promise.reject(error));
  };

  const setupHashError = (error: Error) => {
    userRepository.findByEmailOrUserName.mockResolvedValue(null);
    mockedBcrypt.genSalt.mockResolvedValue('salt123' as never);
    mockedBcrypt.hash.mockImplementation(() => Promise.reject(error));
  };

  describe('Basic Functionality', () => {
    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });
  });

  describe('execute', () => {
    describe('Successful Registration', () => {
      it('should create user when email and username are unique', async () => {
        // Arrange
        setupSuccessfulRegistration();

        // Act
        const result = await useCase.execute(mockCreateUserDto);

        // Assert
        expect(userRepository.findByEmailOrUserName).toHaveBeenCalledWith(
          mockCreateUserDto.email,
          mockCreateUserDto.userName,
        );
        expect(mockedBcrypt.genSalt).toHaveBeenCalled();
        expect(mockedBcrypt.hash).toHaveBeenCalledWith(
          mockCreateUserDto.password,
          'salt123',
        );
        expect(userRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            name: mockCreateUserDto.name,
            lastName: mockCreateUserDto.lastName,
            email: mockCreateUserDto.email,
            phone: mockCreateUserDto.phone,
            userName: mockCreateUserDto.userName,
            password: 'hashedPassword123',
            idRole: mockCreateUserDto.idRole,
            idStatus: 1,
          }),
        );
        expect(result).toEqual(mockCreatedUser);
      });

      it('should set idStatus to 1 by default', async () => {
        // Arrange
        setupSuccessfulRegistration();

        // Act
        await useCase.execute(mockCreateUserDto);

        // Assert
        expect(userRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            idStatus: 1,
          }),
        );
      });

      it('should hash password before creating user', async () => {
        // Arrange
        setupSuccessfulRegistration();

        // Act
        await useCase.execute(mockCreateUserDto);

        // Assert
        expect(mockedBcrypt.genSalt).toHaveBeenCalledTimes(1);
        expect(mockedBcrypt.hash).toHaveBeenCalledTimes(1);
        expect(mockedBcrypt.hash).toHaveBeenCalledWith(
          mockCreateUserDto.password,
          'salt123',
        );
        expect(userRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            password: 'hashedPassword123',
          }),
        );
      });
    });

    describe('Validation Failures', () => {
      it('should throw EmailAlreadyExistsException when email exists', async () => {
        // Arrange
        userRepository.findByEmailOrUserName.mockResolvedValue(
          mockExistingUserWithSameEmail,
        );

        // Act & Assert
        await expect(useCase.execute(mockCreateUserDto)).rejects.toThrow(
          EmailAlreadyExistsException,
        );
        expect(userRepository.findByEmailOrUserName).toHaveBeenCalledWith(
          mockCreateUserDto.email,
          mockCreateUserDto.userName,
        );
        expect(userRepository.create).not.toHaveBeenCalled();
      });

      it('should throw UsernameAlreadyExistsException when username exists', async () => {
        // Arrange
        userRepository.findByEmailOrUserName.mockResolvedValue(
          mockExistingUserWithSameUsername,
        );

        // Act & Assert
        await expect(useCase.execute(mockCreateUserDto)).rejects.toThrow(
          UsernameAlreadyExistsException,
        );
        expect(userRepository.findByEmailOrUserName).toHaveBeenCalledWith(
          mockCreateUserDto.email,
          mockCreateUserDto.userName,
        );
        expect(userRepository.create).not.toHaveBeenCalled();
      });

      it('should not throw exception when existing user has different email and username', async () => {
        // Arrange
        userRepository.findByEmailOrUserName.mockResolvedValue(
          mockExistingUser,
        );
        userRepository.create.mockResolvedValue(mockCreatedUser);
        mockedBcrypt.genSalt.mockResolvedValue('salt123' as never);
        mockedBcrypt.hash.mockResolvedValue('hashedPassword123' as never);

        // Act
        const result = await useCase.execute(mockCreateUserDto);

        // Assert
        expect(result).toEqual(mockCreatedUser);
        expect(userRepository.create).toHaveBeenCalled();
      });
    });

    describe('Repository Integration', () => {
      it('should call userRepository.findByEmailOrUserName with correct parameters', async () => {
        // Arrange
        setupSuccessfulRegistration();

        // Act
        await useCase.execute(mockCreateUserDto);

        // Assert
        expect(userRepository.findByEmailOrUserName).toHaveBeenCalledTimes(1);
        expect(userRepository.findByEmailOrUserName).toHaveBeenCalledWith(
          mockCreateUserDto.email,
          mockCreateUserDto.userName,
        );
      });

      it('should call userRepository.create with correct data structure', async () => {
        // Arrange
        setupSuccessfulRegistration();

        // Act
        await useCase.execute(mockCreateUserDto);

        // Assert
        expect(userRepository.create).toHaveBeenCalledTimes(1);
        expect(userRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            name: mockCreateUserDto.name,
            lastName: mockCreateUserDto.lastName,
            email: mockCreateUserDto.email,
            phone: mockCreateUserDto.phone,
            userName: mockCreateUserDto.userName,
            password: 'hashedPassword123',
            idRole: mockCreateUserDto.idRole,
            idStatus: 1,
          }),
        );
      });
    });

    describe('Error Handling', () => {
      it('should propagate errors from userRepository.findByEmailOrUserName', async () => {
        // Arrange
        const error = new Error('Database connection failed');
        userRepository.findByEmailOrUserName.mockRejectedValue(error);

        // Act & Assert
        await expect(useCase.execute(mockCreateUserDto)).rejects.toThrow(error);
        expect(userRepository.create).not.toHaveBeenCalled();
      });

      it('should propagate errors from userRepository.create', async () => {
        // Arrange
        const error = new Error('Failed to create user');
        userRepository.findByEmailOrUserName.mockResolvedValue(null);
        userRepository.create.mockRejectedValue(error);
        mockedBcrypt.genSalt.mockResolvedValue('salt123' as never);
        mockedBcrypt.hash.mockResolvedValue('hashedPassword123' as never);

        // Act & Assert
        await expect(useCase.execute(mockCreateUserDto)).rejects.toThrow(error);
        expect(userRepository.findByEmailOrUserName).toHaveBeenCalled();
      });

      it('should propagate errors from bcrypt.genSalt', async () => {
        // Arrange
        const error = new Error('Salt generation failed');
        setupBcryptError(error);

        // Act & Assert
        await expect(useCase.execute(mockCreateUserDto)).rejects.toThrow(error);
        expect(userRepository.create).not.toHaveBeenCalled();
      });

      it('should propagate errors from bcrypt.hash', async () => {
        // Arrange
        const error = new Error('Password hashing failed');
        setupHashError(error);

        // Act & Assert
        await expect(useCase.execute(mockCreateUserDto)).rejects.toThrow(error);
        expect(userRepository.create).not.toHaveBeenCalled();
      });
    });
  });
});
