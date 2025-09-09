import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParkingRepository } from './parking.repository';
import { PreEnrolledParking } from '../../domain/entities/pre-enrolled-parking.entity';
import { PreEnrolledParkingModel } from '../../domain/models/pre-enrolled-parking.model';

describe('ParkingRepository', () => {
  let repository: ParkingRepository;
  let typeOrmRepository: jest.Mocked<Repository<PreEnrolledParking>>;

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
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  // TODO: Implementar tests
  // - should find parking by id
  // - should find parking by email
  // - should find parking by internal id
  // - should find parking by external id
  // - should create new parking pre-enrollment
  // - should update existing parking
  // - should delete parking
  // - should find all parkings
  // - should convert entity to PreEnrolledParkingModel
  // - should return null when parking not found
});
