import { PreEnrolledParkingModel } from '../../../src/domain/models/pre-enrolled-parking.model';

export const mockPreEnrolledParkingModel = new PreEnrolledParkingModel(
  1,
  'John Doe',
  '12345678-9',
  '1234567890',
  'john@example.com',
  '123 Main St',
  1,
  'Downtown',
  true,
  3,
  'Test Company',
  'CC',
  '12345678',
  null,
  1,
  '123456',
  'uuid-123',
);

export const mockInactivePreEnrolledParkingModel = new PreEnrolledParkingModel(
  1,
  'John Doe',
  '12345678-9',
  '1234567890',
  'john@example.com',
  '123 Main St',
  1,
  'Downtown',
  true,
  3,
  'Test Company',
  'CC',
  '12345678',
  null,
  0, // isStatus = 0 (inactive)
  '123456',
  'uuid-123',
);

export const mockSingleBranchPreEnrolledParkingModel =
  new PreEnrolledParkingModel(
    1,
    'John Doe',
    '12345678-9',
    '1234567890',
    'john@example.com',
    '123 Main St',
    1,
    'Downtown',
    false, // hasBranches = false
    0,
    'Test Company',
    'CC',
    '12345678',
    null,
    1,
    '123456',
    'uuid-123',
  );

export const mockSingleBranchWithBranchesPreEnrolledParkingModel =
  new PreEnrolledParkingModel(
    1,
    'John Doe',
    '12345678-9',
    '1234567890',
    'john@example.com',
    '123 Main St',
    1,
    'Downtown',
    true,
    1, // numberOfBranches = 1
    'Test Company',
    'CC',
    '12345678',
    null,
    1,
    '123456',
    'uuid-123',
  );

export const mockInvalidEmailPreEnrolledParkingModel =
  new PreEnrolledParkingModel(
    1,
    'John Doe',
    '12345678-9',
    '1234567890',
    'invalid-email', // invalid email
    '123 Main St',
    1,
    'Downtown',
    true,
    3,
    'Test Company',
    'CC',
    '12345678',
    null,
    1,
    '123456',
    'uuid-123',
  );

export const mockInvalidEmailDomainPreEnrolledParkingModel =
  new PreEnrolledParkingModel(
    1,
    'John Doe',
    '12345678-9',
    '1234567890',
    'john@', // invalid email
    '123 Main St',
    1,
    'Downtown',
    true,
    3,
    'Test Company',
    'CC',
    '12345678',
    null,
    1,
    '123456',
    'uuid-123',
  );

export const mockInvalidPhoneLettersPreEnrolledParkingModel =
  new PreEnrolledParkingModel(
    1,
    'John Doe',
    '12345678-9',
    '123abc7890', // invalid phone with letters
    'john@example.com',
    '123 Main St',
    1,
    'Downtown',
    true,
    3,
    'Test Company',
    'CC',
    '12345678',
    null,
    1,
    '123456',
    'uuid-123',
  );

export const mockInvalidPhoneLengthPreEnrolledParkingModel =
  new PreEnrolledParkingModel(
    1,
    'John Doe',
    '12345678-9',
    '12345678901', // invalid phone with 11 digits
    'john@example.com',
    '123 Main St',
    1,
    'Downtown',
    true,
    3,
    'Test Company',
    'CC',
    '12345678',
    null,
    1,
    '123456',
    'uuid-123',
  );

export const mockValidPhonePreEnrolledParkingModel =
  new PreEnrolledParkingModel(
    1,
    'John Doe',
    '12345678-9',
    '1234567890', // valid phone with 10 digits
    'john@example.com',
    '123 Main St',
    1,
    'Downtown',
    true,
    3,
    'Test Company',
    'CC',
    '12345678',
    null,
    1,
    '123456',
    'uuid-123',
  );

export const mockEntityForFromEntity = {
  id: 2,
  legalRepresentative: 'Jane Smith',
  nitDV: '87654321-0',
  phone: '0987654321',
  email: 'jane@example.com',
  address: '456 Oak Ave',
  city: 2,
  neighborhood: 'Uptown',
  hasBranches: false,
  numberOfBranches: 0,
  companyName: 'Another Company',
  documentType: 'NIT',
  documentNumber: '87654321',
  idFiles: 1,
  isStatus: 0,
  internalId: null,
  externalId: 'uuid-456',
};
