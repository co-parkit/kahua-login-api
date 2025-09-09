import { ParkingRepository } from '../../../src/infrastructure/repositories/parking.repository';

export const createMockParkingRepository = () => ({
  findByEmail: jest.fn(),
  create: jest.fn(),
});

export type MockParkingRepository = jest.Mocked<ParkingRepository>;
