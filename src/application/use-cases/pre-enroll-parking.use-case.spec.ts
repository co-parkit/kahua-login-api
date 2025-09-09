import { Test, TestingModule } from '@nestjs/testing';
import { PreEnrollParkingUseCase } from './pre-enroll-parking.use-case';
import { ParkingRepository } from '../../infrastructure/repositories/parking.repository';
import {
  ParkingEmailAlreadyExistsException,
  InvalidBusinessRuleException,
} from '../../domain/exceptions';
import {
  mockPreSignUpDto,
  mockPreSignUpDtoWithInternalId,
  mockPreSignUpDtoWithBranches,
  mockPreSignUpDtoInvalidBranches,
  mockPreSignUpDtoNegativeBranches,
} from '../../../test/mocks/parking/parking-dto.mock';
import { mockCreatedParking } from '../../../test/mocks/parking/parking-model.mock';
import {
  createMockParkingRepository,
  MockParkingRepository,
} from '../../../test/mocks/repositories/parking-repository.mock';

describe('PreEnrollParkingUseCase', () => {
  let useCase: PreEnrollParkingUseCase;
  let parkingRepository: MockParkingRepository;

  beforeEach(async () => {
    const mockParkingRepository = createMockParkingRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreEnrollParkingUseCase,
        {
          provide: ParkingRepository,
          useValue: mockParkingRepository,
        },
      ],
    }).compile();

    useCase = module.get<PreEnrollParkingUseCase>(PreEnrollParkingUseCase);
    parkingRepository = module.get(ParkingRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });
  });

  describe('execute', () => {
    describe('Successful Pre-enrollment', () => {
      it('should create parking pre-enrollment when email is unique', async () => {
        // Arrange
        parkingRepository.findByEmail.mockResolvedValue(null);
        parkingRepository.create.mockResolvedValue(mockCreatedParking);

        // Act
        const result = await useCase.execute(mockPreSignUpDto);

        // Assert
        expect(parkingRepository.findByEmail).toHaveBeenCalledWith(
          mockPreSignUpDto.email,
        );
        expect(parkingRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            legalRepresentative: mockPreSignUpDto.legalRepresentative,
            nitDV: mockPreSignUpDto.nitDV,
            phone: mockPreSignUpDto.phone,
            email: mockPreSignUpDto.email,
            address: mockPreSignUpDto.address,
            city: mockPreSignUpDto.city,
            neighborhood: mockPreSignUpDto.neighborhood,
            hasBranches: mockPreSignUpDto.hasBranches,
            numberOfBranches: mockPreSignUpDto.numberOfBranches,
            companyName: mockPreSignUpDto.companyName,
            documentType: mockPreSignUpDto.documentType,
            documentNumber: mockPreSignUpDto.documentNumber,
            idFiles: null,
            isStatus: 1,
            internalId: mockPreSignUpDto.internalId,
            externalId: expect.any(String),
          }),
        );
        expect(result).toEqual(mockCreatedParking);
      });

      it('should generate externalId when internalId is not provided', async () => {
        // Arrange
        parkingRepository.findByEmail.mockResolvedValue(null);
        parkingRepository.create.mockResolvedValue(mockCreatedParking);

        // Act
        await useCase.execute(mockPreSignUpDto);

        // Assert
        expect(parkingRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            internalId: null,
            externalId: expect.any(String),
          }),
        );
      });

      it('should set internalId and null externalId when internalId is provided', async () => {
        // Arrange
        parkingRepository.findByEmail.mockResolvedValue(null);
        parkingRepository.create.mockResolvedValue(mockCreatedParking);

        // Act
        await useCase.execute(mockPreSignUpDtoWithInternalId);

        // Assert
        expect(parkingRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            internalId: 'internal-123',
            externalId: null,
          }),
        );
      });

      it('should set isStatus to 1 by default', async () => {
        // Arrange
        parkingRepository.findByEmail.mockResolvedValue(null);
        parkingRepository.create.mockResolvedValue(mockCreatedParking);

        // Act
        await useCase.execute(mockPreSignUpDto);

        // Assert
        expect(parkingRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            isStatus: 1,
          }),
        );
      });
    });

    describe('Business Rule Validations', () => {
      it('should throw ParkingEmailAlreadyExistsException when email exists', async () => {
        // Arrange
        const existingParking = mockCreatedParking;
        parkingRepository.findByEmail.mockResolvedValue(existingParking);

        // Act & Assert
        await expect(useCase.execute(mockPreSignUpDto)).rejects.toThrow(
          ParkingEmailAlreadyExistsException,
        );
        expect(parkingRepository.findByEmail).toHaveBeenCalledWith(
          mockPreSignUpDto.email,
        );
        expect(parkingRepository.create).not.toHaveBeenCalled();
      });

      it('should throw InvalidBusinessRuleException when hasBranches is true but numberOfBranches <= 0', async () => {
        // Arrange
        parkingRepository.findByEmail.mockResolvedValue(null);

        // Act & Assert
        await expect(
          useCase.execute(mockPreSignUpDtoInvalidBranches),
        ).rejects.toThrow(InvalidBusinessRuleException);
        expect(parkingRepository.findByEmail).toHaveBeenCalledWith(
          mockPreSignUpDtoInvalidBranches.email,
        );
        expect(parkingRepository.create).not.toHaveBeenCalled();
      });

      it('should throw InvalidBusinessRuleException when hasBranches is true but numberOfBranches is negative', async () => {
        // Arrange
        parkingRepository.findByEmail.mockResolvedValue(null);

        // Act & Assert
        await expect(
          useCase.execute(mockPreSignUpDtoNegativeBranches),
        ).rejects.toThrow(InvalidBusinessRuleException);
        expect(parkingRepository.create).not.toHaveBeenCalled();
      });

      it('should allow hasBranches true with numberOfBranches > 0', async () => {
        // Arrange
        parkingRepository.findByEmail.mockResolvedValue(null);
        parkingRepository.create.mockResolvedValue(mockCreatedParking);

        // Act
        const result = await useCase.execute(mockPreSignUpDtoWithBranches);

        // Assert
        expect(parkingRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            hasBranches: true,
            numberOfBranches: 3,
          }),
        );
        expect(result).toEqual(mockCreatedParking);
      });
    });

    describe('Repository Integration', () => {
      it('should call parkingRepository.findByEmail with correct email', async () => {
        // Arrange
        parkingRepository.findByEmail.mockResolvedValue(null);
        parkingRepository.create.mockResolvedValue(mockCreatedParking);

        // Act
        await useCase.execute(mockPreSignUpDto);

        // Assert
        expect(parkingRepository.findByEmail).toHaveBeenCalledTimes(1);
        expect(parkingRepository.findByEmail).toHaveBeenCalledWith(
          mockPreSignUpDto.email,
        );
      });

      it('should call parkingRepository.create with correct data structure', async () => {
        // Arrange
        parkingRepository.findByEmail.mockResolvedValue(null);
        parkingRepository.create.mockResolvedValue(mockCreatedParking);

        // Act
        await useCase.execute(mockPreSignUpDto);

        // Assert
        expect(parkingRepository.create).toHaveBeenCalledTimes(1);
        expect(parkingRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            legalRepresentative: mockPreSignUpDto.legalRepresentative,
            nitDV: mockPreSignUpDto.nitDV,
            phone: mockPreSignUpDto.phone,
            email: mockPreSignUpDto.email,
            address: mockPreSignUpDto.address,
            city: mockPreSignUpDto.city,
            neighborhood: mockPreSignUpDto.neighborhood,
            hasBranches: mockPreSignUpDto.hasBranches,
            numberOfBranches: mockPreSignUpDto.numberOfBranches,
            companyName: mockPreSignUpDto.companyName,
            documentType: mockPreSignUpDto.documentType,
            documentNumber: mockPreSignUpDto.documentNumber,
            idFiles: null,
            isStatus: 1,
          }),
        );
      });
    });

    describe('Error Handling', () => {
      it('should propagate errors from parkingRepository.findByEmail', async () => {
        // Arrange
        const error = new Error('Database connection failed');
        parkingRepository.findByEmail.mockRejectedValue(error);

        // Act & Assert
        await expect(useCase.execute(mockPreSignUpDto)).rejects.toThrow(error);
        expect(parkingRepository.create).not.toHaveBeenCalled();
      });

      it('should propagate errors from parkingRepository.create', async () => {
        // Arrange
        const error = new Error('Failed to create parking');
        parkingRepository.findByEmail.mockResolvedValue(null);
        parkingRepository.create.mockRejectedValue(error);

        // Act & Assert
        await expect(useCase.execute(mockPreSignUpDto)).rejects.toThrow(error);
        expect(parkingRepository.findByEmail).toHaveBeenCalled();
      });
    });
  });
});
