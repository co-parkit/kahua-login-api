import { PreSignUpParkingDto } from '../../../src/application/dtos/parking.dto';

export const mockPreSignUpDto: PreSignUpParkingDto = {
  legalRepresentative: 'John Doe',
  nitDV: '12345678-9',
  phone: '1234567890',
  email: 'test@parking.com',
  address: '123 Main St',
  city: 1,
  neighborhood: 'Centro',
  hasBranches: false,
  numberOfBranches: 0,
  companyName: 'Test Parking',
  documentType: 'NIT',
  documentNumber: '12345678',
  internalId: null,
};

export const mockPreSignUpDtoWithInternalId: PreSignUpParkingDto = {
  ...mockPreSignUpDto,
  internalId: 'internal-123',
};

export const mockPreSignUpDtoWithBranches: PreSignUpParkingDto = {
  ...mockPreSignUpDto,
  hasBranches: true,
  numberOfBranches: 3,
};

export const mockPreSignUpDtoInvalidBranches: PreSignUpParkingDto = {
  ...mockPreSignUpDto,
  hasBranches: true,
  numberOfBranches: 0,
};

export const mockPreSignUpDtoNegativeBranches: PreSignUpParkingDto = {
  ...mockPreSignUpDto,
  hasBranches: true,
  numberOfBranches: -1,
};
