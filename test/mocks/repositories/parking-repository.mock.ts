import { Repository } from 'typeorm';
import { PreEnrolledParking } from '../../../src/domain/entities/pre-enrolled-parking.entity';
import { PreEnrolledParkingModel } from '../../../src/domain/models/pre-enrolled-parking.model';

// Mock de la entidad PreEnrolledParking
export const mockPreEnrolledParkingEntity = {
  id: 1,
  legalRepresentative: 'John Doe',
  nitDV: '12345678-9',
  phone: '1234567890',
  email: 'test@example.com',
  address: '123 Test Street',
  city: 1,
  neighborhood: 'Test Neighborhood',
  hasBranches: false,
  numberOfBranches: 0,
  companyName: 'Test Parking Company',
  documentType: 'CC',
  documentNumber: '12345678',
  idFiles: null,
  isStatus: 1,
  internalId: 'INT-001',
  externalId: 'EXT-001',
} as PreEnrolledParking;

// Mock del modelo PreEnrolledParkingModel
export const mockPreEnrolledParkingModel = {
  id: 1,
  legalRepresentative: 'John Doe',
  nitDV: '12345678-9',
  phone: '1234567890',
  email: 'test@example.com',
  address: '123 Test Street',
  city: 1,
  neighborhood: 'Test Neighborhood',
  hasBranches: false,
  numberOfBranches: 0,
  companyName: 'Test Parking Company',
  documentType: 'CC',
  documentNumber: '12345678',
  idFiles: null,
  isStatus: 1,
  internalId: 'INT-001',
  externalId: 'EXT-001',
  toPlainObject: jest.fn().mockReturnValue({
    id: 1,
    legalRepresentative: 'John Doe',
    nitDV: '12345678-9',
    phone: '1234567890',
    email: 'test@example.com',
    address: '123 Test Street',
    city: 1,
    neighborhood: 'Test Neighborhood',
    hasBranches: false,
    numberOfBranches: 0,
    companyName: 'Test Parking Company',
    documentType: 'CC',
    documentNumber: '12345678',
    idFiles: null,
    isStatus: 1,
    internalId: 'INT-001',
    externalId: 'EXT-001',
  }),
} as unknown as PreEnrolledParkingModel;

// Mock del repositorio TypeORM
export const mockTypeOrmRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
} as unknown as Repository<PreEnrolledParking>;

// Mock de datos de parqueadero para crear
export const mockCreateParkingData = {
  email: 'new@example.com',
  name: 'New Parking',
  address: '456 New Street',
  phone: '9876543210',
  hasBranches: true,
  numberOfBranches: 3,
  internalId: 'INT-002',
  externalId: 'EXT-002',
  isStatus: 1,
} as Partial<PreEnrolledParkingModel>;

// Mock de datos de parqueadero para actualizar
export const mockUpdateParkingData = {
  name: 'Updated Parking',
  address: '789 Updated Street',
  phone: '1111111111',
} as Partial<PreEnrolledParkingModel>;

// Mock de resultado de eliminación
export const mockDeleteResult = {
  affected: 1,
  raw: [],
};

// Mock de resultado de actualización
export const mockUpdateResult = {
  affected: 1,
  raw: [],
  generatedMaps: [],
};

// Mock de múltiples parqueaderos
export const mockMultipleParkings = [
  {
    id: 1,
    legalRepresentative: 'John Doe',
    nitDV: '12345678-9',
    phone: '1111111111',
    email: 'parking1@example.com',
    address: 'Address 1',
    city: 1,
    neighborhood: 'Neighborhood 1',
    hasBranches: false,
    numberOfBranches: 0,
    companyName: 'Parking Company 1',
    documentType: 'CC',
    documentNumber: '11111111',
    idFiles: null,
    isStatus: 1,
    internalId: 'INT-001',
    externalId: 'EXT-001',
  },
  {
    id: 2,
    legalRepresentative: 'Jane Smith',
    nitDV: '87654321-0',
    phone: '2222222222',
    email: 'parking2@example.com',
    address: 'Address 2',
    city: 2,
    neighborhood: 'Neighborhood 2',
    hasBranches: true,
    numberOfBranches: 2,
    companyName: 'Parking Company 2',
    documentType: 'NIT',
    documentNumber: '22222222',
    idFiles: 1,
    isStatus: 1,
    internalId: 'INT-002',
    externalId: 'EXT-002',
  },
] as PreEnrolledParking[];

// Mock de modelos de múltiples parqueaderos
export const mockMultipleParkingModels = [
  {
    id: 1,
    legalRepresentative: 'John Doe',
    nitDV: '12345678-9',
    phone: '1111111111',
    email: 'parking1@example.com',
    address: 'Address 1',
    city: 1,
    neighborhood: 'Neighborhood 1',
    hasBranches: false,
    numberOfBranches: 0,
    companyName: 'Parking Company 1',
    documentType: 'CC',
    documentNumber: '11111111',
    idFiles: null,
    isStatus: 1,
    internalId: 'INT-001',
    externalId: 'EXT-001',
    toPlainObject: jest.fn().mockReturnValue({
      id: 1,
      legalRepresentative: 'John Doe',
      nitDV: '12345678-9',
      phone: '1111111111',
      email: 'parking1@example.com',
      address: 'Address 1',
      city: 1,
      neighborhood: 'Neighborhood 1',
      hasBranches: false,
      numberOfBranches: 0,
      companyName: 'Parking Company 1',
      documentType: 'CC',
      documentNumber: '11111111',
      idFiles: null,
      isStatus: 1,
      internalId: 'INT-001',
      externalId: 'EXT-001',
    }),
  },
  {
    id: 2,
    legalRepresentative: 'Jane Smith',
    nitDV: '87654321-0',
    phone: '2222222222',
    email: 'parking2@example.com',
    address: 'Address 2',
    city: 2,
    neighborhood: 'Neighborhood 2',
    hasBranches: true,
    numberOfBranches: 2,
    companyName: 'Parking Company 2',
    documentType: 'NIT',
    documentNumber: '22222222',
    idFiles: 1,
    isStatus: 1,
    internalId: 'INT-002',
    externalId: 'EXT-002',
    toPlainObject: jest.fn().mockReturnValue({
      id: 2,
      legalRepresentative: 'Jane Smith',
      nitDV: '87654321-0',
      phone: '2222222222',
      email: 'parking2@example.com',
      address: 'Address 2',
      city: 2,
      neighborhood: 'Neighborhood 2',
      hasBranches: true,
      numberOfBranches: 2,
      companyName: 'Parking Company 2',
      documentType: 'NIT',
      documentNumber: '22222222',
      idFiles: 1,
      isStatus: 1,
      internalId: 'INT-002',
      externalId: 'EXT-002',
    }),
  },
] as unknown as PreEnrolledParkingModel[];

// Mock de PreEnrolledParkingModel.fromEntity
export const mockFromEntity = jest.fn().mockReturnValue(mockPreEnrolledParkingModel);

// Mock de PreEnrolledParkingModel
export const mockPreEnrolledParkingModelClass = {
  fromEntity: mockFromEntity,
} as unknown as typeof PreEnrolledParkingModel;

// Mock del repositorio para use cases
export const MockParkingRepository = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByInternalId: jest.fn(),
  findByExternalId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findAll: jest.fn(),
};

// Función para crear mock del repositorio
export const createMockParkingRepository = () => ({
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByInternalId: jest.fn(),
  findByExternalId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findAll: jest.fn(),
});