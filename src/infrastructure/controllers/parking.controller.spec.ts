import { Test, TestingModule } from '@nestjs/testing';
import { ParkingController } from './parking.controller';
import { PreEnrollParkingUseCase } from '../../application/use-cases/pre-enroll-parking.use-case';
import { PreSignUpParkingDto } from '../../application/dtos/parking.dto';

describe('ParkingController', () => {
  let controller: ParkingController;
  let preEnrollParkingUseCase: jest.Mocked<PreEnrollParkingUseCase>;

  beforeEach(async () => {
    const mockPreEnrollParkingUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkingController],
      providers: [
        {
          provide: PreEnrollParkingUseCase,
          useValue: mockPreEnrollParkingUseCase,
        },
      ],
    }).compile();

    controller = module.get<ParkingController>(ParkingController);
    preEnrollParkingUseCase = module.get(PreEnrollParkingUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // TODO: Implementar tests
  // - should pre-enroll parking successfully
  // - should call pre-enroll parking use case with correct parameters
  // - should return proper response format
  // - should handle errors from use case
  // - should validate input data
});
