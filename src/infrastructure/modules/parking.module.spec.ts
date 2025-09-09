import { Test, TestingModule } from '@nestjs/testing';
import { ParkingModule } from './parking.module';

describe('ParkingModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ParkingModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  // TODO: Implementar tests
  // - should compile module successfully
  // - should provide all required services
  // - should export ParkingRepository
  // - should configure TypeORM entities
  // - should provide PreEnrollParkingUseCase
});
