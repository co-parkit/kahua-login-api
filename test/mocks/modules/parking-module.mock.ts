import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreEnrolledParking } from '../../../src/domain/entities/pre-enrolled-parking.entity';
import { PreEnrollParkingUseCase } from '../../../src/application/use-cases/pre-enroll-parking.use-case';
import { ParkingController } from '../../../src/infrastructure/controllers/parking.controller';
import { ParkingRepository } from '../../../src/infrastructure/repositories/parking.repository';
import { DatabaseModule } from '../../../src/config/database.module';

export const mockPreEnrolledParkingEntity = {
  id: 1,
  email: 'test@example.com',
  name: 'Test Parking',
  address: '123 Test Street',
  phone: '1234567890',
  hasBranches: false,
  numberOfBranches: 0,
  internalId: 'INT-001',
  externalId: 'EXT-001',
  isStatus: 1,
  createdAt: new Date('2023-01-01T00:00:00Z'),
  updatedAt: new Date('2023-01-01T00:00:00Z'),
} as PreEnrolledParking;

export const mockPreEnrollParkingUseCase = {
  execute: jest.fn(),
} as unknown as PreEnrollParkingUseCase;

export const mockParkingController = {
  preEnroll: jest.fn(),
} as unknown as ParkingController;

export const mockParkingRepository = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
} as unknown as ParkingRepository;

export const mockDatabaseModule = {
  providers: [],
  exports: [],
} as unknown as DatabaseModule;

export const mockTypeOrmModule = {
  forFeature: jest.fn().mockReturnValue({
    providers: [],
    exports: [],
  }),
};

export const mockModuleMetadata = {
  imports: [mockTypeOrmModule.forFeature([PreEnrolledParking]), mockDatabaseModule],
  controllers: [mockParkingController],
  providers: [mockPreEnrollParkingUseCase, mockParkingRepository],
  exports: [mockParkingRepository],
};

export const mockModuleDecorator = jest.fn().mockImplementation((metadata) => {
  return (target: any) => {
    target.prototype.__moduleMetadata = metadata;
    return target;
  };
});

export const mockNestJSModule = {
  Module: mockModuleDecorator,
};

export const mockTypeOrmModuleForFeature = jest.fn().mockReturnValue({
  providers: [],
  exports: [],
});

export const mockExpectedImports = [
  mockTypeOrmModuleForFeature([PreEnrolledParking]),
  mockDatabaseModule,
];

export const mockExpectedControllers = [mockParkingController];

export const mockExpectedProviders = [mockPreEnrollParkingUseCase, mockParkingRepository];

export const mockExpectedExports = [mockParkingRepository];

export const mockModuleConfiguration = {
  imports: mockExpectedImports,
  controllers: mockExpectedControllers,
  providers: mockExpectedProviders,
  exports: mockExpectedExports,
};
