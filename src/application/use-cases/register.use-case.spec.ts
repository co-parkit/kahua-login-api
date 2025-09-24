import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUseCase } from './register.use-case';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { EmailAlreadyExistsException } from '../../domain/exceptions';
import * as bcrypt from 'bcrypt';
import {
  mockCreatedUser,
  mockExistingUserWithSameEmail,
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
    userRepository.create.mockResolvedValue(mockCreatedUser);
    mockedBcrypt.genSalt.mockResolvedValue('salt123' as never);
    mockedBcrypt.hash.mockResolvedValue('hashedPassword123' as never);
  };

  const setupBcryptError = (error: Error) => {
    mockedBcrypt.genSalt.mockImplementation(() => Promise.reject(error));
  };

  const setupHashError = (error: Error) => {
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

        expect(mockedBcrypt.genSalt).toHaveBeenCalled();
        expect(mockedBcrypt.hash).toHaveBeenCalledWith(
          mockCreateUserDto.password,
          'salt123',
        );
        expect(userRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            email: mockCreateUserDto.email,
            passwordHash: 'hashedPassword123',
            userType: mockCreateUserDto.user_type,
            roleId: mockCreateUserDto.role_id,
          }),
        );
        expect(result).toEqual(mockCreatedUser);
      });

      it('should set userType correctly', async () => {
        // Arrange
        setupSuccessfulRegistration();

        // Act
        await useCase.execute(mockCreateUserDto);

        // Assert
        expect(userRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            userType: mockCreateUserDto.user_type,
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
            passwordHash: 'hashedPassword123',
          }),
        );
      });
    });

    describe('Validation Failures', () => {
      it('should throw EmailAlreadyExistsException when email exists', async () => {
        // Arrange
        userRepository.findByEmail.mockResolvedValue(
          mockExistingUserWithSameEmail,
        );

        // Act & Assert
        await expect(useCase.execute(mockCreateUserDto)).rejects.toThrow(
          EmailAlreadyExistsException,
        );
        expect(userRepository.findByEmail).toHaveBeenCalledWith(
          mockCreateUserDto.email,
        );
        expect(userRepository.create).not.toHaveBeenCalled();
      });

      it('should throw EmailAlreadyExistsException when email exists', async () => {
        // Arrange
        userRepository.findByEmail.mockResolvedValue(
          mockExistingUserWithSameEmail,
        );

        // Act & Assert
        await expect(useCase.execute(mockCreateUserDto)).rejects.toThrow(
          EmailAlreadyExistsException,
        );
        expect(userRepository.findByEmail).toHaveBeenCalledWith(
          mockCreateUserDto.email,
        );
        expect(userRepository.create).not.toHaveBeenCalled();
      });

      it('should not throw exception when existing user has different email', async () => {
        // Arrange
        userRepository.findByEmail.mockResolvedValue(null);
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
      it('should call userRepository.findByEmail with correct parameters', async () => {
        // Arrange
        setupSuccessfulRegistration();

        // Act
        await useCase.execute(mockCreateUserDto);

        // Assert
        expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
        expect(userRepository.findByEmail).toHaveBeenCalledWith(
          mockCreateUserDto.email,
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
            email: mockCreateUserDto.email,
            passwordHash: 'hashedPassword123',
            userType: mockCreateUserDto.user_type,
            roleId: mockCreateUserDto.role_id,
          }),
        );
      });
    });

    describe('Error Handling', () => {
      it('should propagate errors from userRepository.findByEmail', async () => {
        // Arrange
        const error = new Error('Database connection failed');
        userRepository.findByEmail.mockRejectedValue(error);

        // Act & Assert
        await expect(useCase.execute(mockCreateUserDto)).rejects.toThrow(error);
        expect(userRepository.create).not.toHaveBeenCalled();
      });

      it('should propagate errors from userRepository.create', async () => {
        // Arrange
        const error = new Error('Failed to create user');
        userRepository.findByEmail.mockResolvedValue(null);
        userRepository.create.mockRejectedValue(error);
        mockedBcrypt.genSalt.mockResolvedValue('salt123' as never);
        mockedBcrypt.hash.mockResolvedValue('hashedPassword123' as never);

        // Act & Assert
        await expect(useCase.execute(mockCreateUserDto)).rejects.toThrow(error);
        expect(userRepository.findByEmail).toHaveBeenCalled();
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
