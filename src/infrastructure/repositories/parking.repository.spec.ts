import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParkingRepository } from './parking.repository';
import { PreEnrolledParking } from '../../domain/entities/pre-enrolled-parking.entity';
import { PreEnrolledParkingModel } from '../../domain/models/pre-enrolled-parking.model';
import {
  mockPreEnrolledParkingEntity,
  mockPreEnrolledParkingModel,
  mockCreateParkingData,
  mockUpdateParkingData,
  mockDeleteResult,
  mockUpdateResult,
  mockMultipleParkings,
  mockMultipleParkingModels,
} from '../../../test/mocks/repositories/parking-repository.mock';

// Mock PreEnrolledParkingModel
jest.mock('../../domain/models/pre-enrolled-parking.model', () => ({
  PreEnrolledParkingModel: {
    fromEntity: jest.fn(),
  },
}));

describe('ParkingRepository', () => {
  let repository: ParkingRepository;
  let typeOrmRepository: jest.Mocked<Repository<PreEnrolledParking>>;
  const mockFromEntity = PreEnrolledParkingModel.fromEntity as jest.Mock;

  beforeEach(async () => {
    const mockTypeOrmRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParkingRepository,
        {
          provide: getRepositoryToken(PreEnrolledParking),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<ParkingRepository>(ParkingRepository);
    typeOrmRepository = module.get(getRepositoryToken(PreEnrolledParking));

    // Reset mocks
    jest.clearAllMocks();
    mockFromEntity.mockReturnValue(mockPreEnrolledParkingModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should be defined', () => {
      expect(repository).toBeDefined();
    });

    it('should be an instance of ParkingRepository', () => {
      expect(repository).toBeInstanceOf(ParkingRepository);
    });

    it('should have TypeORM repository injected', () => {
      expect(typeOrmRepository).toBeDefined();
    });
  });

  describe('findById', () => {
    it('should find parking by id', async () => {
      // Arrange
      const id = 1;
      typeOrmRepository.findOne.mockResolvedValue(mockPreEnrolledParkingEntity);

      // Act
      const result = await repository.findById(id);

      // Assert
      expect(result).toEqual(mockPreEnrolledParkingModel);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(mockFromEntity).toHaveBeenCalledWith(mockPreEnrolledParkingEntity);
    });

    it('should return null when parking not found', async () => {
      // Arrange
      const id = 999;
      typeOrmRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await repository.findById(id);

      // Assert
      expect(result).toBeNull();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(mockFromEntity).not.toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      // Arrange
      const id = 1;
      const error = new Error('Database error');
      typeOrmRepository.findOne.mockRejectedValue(error);

      // Act & Assert
      await expect(repository.findById(id)).rejects.toThrow('Database error');
    });
  });

  describe('findByEmail', () => {
    it('should find parking by email', async () => {
      // Arrange
      const email = 'test@example.com';
      typeOrmRepository.findOne.mockResolvedValue(mockPreEnrolledParkingEntity);

      // Act
      const result = await repository.findByEmail(email);

      // Assert
      expect(result).toEqual(mockPreEnrolledParkingModel);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(mockFromEntity).toHaveBeenCalledWith(mockPreEnrolledParkingEntity);
    });

    it('should return null when parking not found by email', async () => {
      // Arrange
      const email = 'notfound@example.com';
      typeOrmRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await repository.findByEmail(email);

      // Assert
      expect(result).toBeNull();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });

  describe('findByInternalId', () => {
    it('should find parking by internal id', async () => {
      // Arrange
      const internalId = 'INT-001';
      typeOrmRepository.findOne.mockResolvedValue(mockPreEnrolledParkingEntity);

      // Act
      const result = await repository.findByInternalId(internalId);

      // Assert
      expect(result).toEqual(mockPreEnrolledParkingModel);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { internalId },
      });
      expect(mockFromEntity).toHaveBeenCalledWith(mockPreEnrolledParkingEntity);
    });

    it('should return null when parking not found by internal id', async () => {
      // Arrange
      const internalId = 'INT-999';
      typeOrmRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await repository.findByInternalId(internalId);

      // Assert
      expect(result).toBeNull();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { internalId },
      });
    });
  });

  describe('findByExternalId', () => {
    it('should find parking by external id', async () => {
      // Arrange
      const externalId = 'EXT-001';
      typeOrmRepository.findOne.mockResolvedValue(mockPreEnrolledParkingEntity);

      // Act
      const result = await repository.findByExternalId(externalId);

      // Assert
      expect(result).toEqual(mockPreEnrolledParkingModel);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { externalId },
      });
      expect(mockFromEntity).toHaveBeenCalledWith(mockPreEnrolledParkingEntity);
    });

    it('should return null when parking not found by external id', async () => {
      // Arrange
      const externalId = 'EXT-999';
      typeOrmRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await repository.findByExternalId(externalId);

      // Assert
      expect(result).toBeNull();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { externalId },
      });
    });
  });

  describe('create', () => {
    it('should create new parking pre-enrollment', async () => {
      // Arrange
      const createdEntity = { ...mockPreEnrolledParkingEntity, id: 1 };
      typeOrmRepository.create.mockReturnValue(createdEntity);
      typeOrmRepository.save.mockResolvedValue(createdEntity);

      // Act
      const result = await repository.create(mockCreateParkingData);

      // Assert
      expect(result).toEqual(mockPreEnrolledParkingModel);
      expect(typeOrmRepository.create).toHaveBeenCalledWith(
        mockCreateParkingData,
      );
      expect(typeOrmRepository.save).toHaveBeenCalledWith(createdEntity);
      expect(mockFromEntity).toHaveBeenCalledWith(createdEntity);
    });

    it('should handle database errors during creation', async () => {
      // Arrange
      const error = new Error('Database error');
      typeOrmRepository.create.mockReturnValue(mockPreEnrolledParkingEntity);
      typeOrmRepository.save.mockRejectedValue(error);

      // Act & Assert
      await expect(repository.create(mockCreateParkingData)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('update', () => {
    it('should update existing parking', async () => {
      // Arrange
      const id = 1;
      const updatedEntity = {
        ...mockPreEnrolledParkingEntity,
        ...mockUpdateParkingData,
      };
      typeOrmRepository.update.mockResolvedValue(mockUpdateResult);
      typeOrmRepository.findOne.mockResolvedValue(updatedEntity);

      // Act
      const result = await repository.update(id, mockUpdateParkingData);

      // Assert
      expect(result).toEqual(mockPreEnrolledParkingModel);
      expect(typeOrmRepository.update).toHaveBeenCalledWith(
        id,
        mockUpdateParkingData,
      );
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(mockFromEntity).toHaveBeenCalledWith(updatedEntity);
    });

    it('should handle database errors during update', async () => {
      // Arrange
      const id = 1;
      const error = new Error('Database error');
      typeOrmRepository.update.mockRejectedValue(error);

      // Act & Assert
      await expect(
        repository.update(id, mockUpdateParkingData),
      ).rejects.toThrow('Database error');
    });
  });

  describe('delete', () => {
    it('should delete parking', async () => {
      // Arrange
      const id = 1;
      typeOrmRepository.delete.mockResolvedValue(mockDeleteResult);

      // Act
      const result = await repository.delete(id);

      // Assert
      expect(result).toBe(true);
      expect(typeOrmRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should return false when no parking was deleted', async () => {
      // Arrange
      const id = 999;
      const deleteResult = { affected: 0, raw: [] };
      typeOrmRepository.delete.mockResolvedValue(deleteResult);

      // Act
      const result = await repository.delete(id);

      // Assert
      expect(result).toBe(false);
      expect(typeOrmRepository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('findAll', () => {
    it('should find all parkings', async () => {
      // Arrange
      typeOrmRepository.find.mockResolvedValue(mockMultipleParkings);
      mockFromEntity
        .mockReturnValueOnce(mockMultipleParkingModels[0])
        .mockReturnValueOnce(mockMultipleParkingModels[1]);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(result).toEqual(mockMultipleParkingModels);
      expect(typeOrmRepository.find).toHaveBeenCalledWith();
      expect(mockFromEntity).toHaveBeenCalledTimes(2);
    });

    it('should return empty array when no parkings found', async () => {
      // Arrange
      typeOrmRepository.find.mockResolvedValue([]);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(result).toEqual([]);
      expect(typeOrmRepository.find).toHaveBeenCalledWith();
      expect(mockFromEntity).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle null values gracefully', async () => {
      // Arrange
      typeOrmRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await repository.findById(1);

      // Assert
      expect(result).toBeNull();
      expect(mockFromEntity).not.toHaveBeenCalled();
    });

    it('should propagate errors from TypeORM repository', async () => {
      // Arrange
      const error = new Error('TypeORM error');
      typeOrmRepository.findOne.mockRejectedValue(error);

      // Act & Assert
      await expect(repository.findById(1)).rejects.toThrow('TypeORM error');
    });
  });
});
