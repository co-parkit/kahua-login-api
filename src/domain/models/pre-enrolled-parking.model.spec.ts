import { PreEnrolledParkingModel } from './pre-enrolled-parking.model';
import {
  mockPreEnrolledParkingModel,
  mockInactivePreEnrolledParkingModel,
  mockSingleBranchPreEnrolledParkingModel,
  mockSingleBranchWithBranchesPreEnrolledParkingModel,
  mockInvalidEmailPreEnrolledParkingModel,
  mockInvalidEmailDomainPreEnrolledParkingModel,
  mockInvalidPhoneLettersPreEnrolledParkingModel,
  mockInvalidPhoneLengthPreEnrolledParkingModel,
  mockValidPhonePreEnrolledParkingModel,
  mockEntityForFromEntity,
} from '../../../test/mocks/parking/pre-enrolled-parking-model.mock';

describe('PreEnrolledParkingModel', () => {
  let parkingModel: PreEnrolledParkingModel;

  beforeEach(() => {
    parkingModel = mockPreEnrolledParkingModel;
  });

  it('should be defined', () => {
    expect(parkingModel).toBeDefined();
  });

  describe('Constructor', () => {
    it('should create PreEnrolledParkingModel with correct properties', () => {
      expect(parkingModel.id).toBe(1);
      expect(parkingModel.legalRepresentative).toBe('John Doe');
      expect(parkingModel.nitDV).toBe('12345678-9');
      expect(parkingModel.phone).toBe('1234567890');
      expect(parkingModel.email).toBe('john@example.com');
      expect(parkingModel.address).toBe('123 Main St');
      expect(parkingModel.city).toBe(1);
      expect(parkingModel.neighborhood).toBe('Downtown');
      expect(parkingModel.hasBranches).toBe(true);
      expect(parkingModel.numberOfBranches).toBe(3);
      expect(parkingModel.companyName).toBe('Test Company');
      expect(parkingModel.documentType).toBe('CC');
      expect(parkingModel.documentNumber).toBe('12345678');
      expect(parkingModel.idFiles).toBe(null);
      expect(parkingModel.isStatus).toBe(1);
      expect(parkingModel.internalId).toBe('123456');
      expect(parkingModel.externalId).toBe('uuid-123');
    });
  });

  describe('isActive', () => {
    it('should return true for isActive when isStatus is 1', () => {
      expect(parkingModel.isActive()).toBe(true);
    });

    it('should return false for isActive when isStatus is not 1', () => {
      expect(mockInactivePreEnrolledParkingModel.isActive()).toBe(false);
    });
  });

  describe('hasMultipleBranches', () => {
    it('should return true for hasMultipleBranches when hasBranches is true and numberOfBranches > 1', () => {
      expect(parkingModel.hasMultipleBranches()).toBe(true);
    });

    it('should return false for hasMultipleBranches when hasBranches is false', () => {
      expect(
        mockSingleBranchPreEnrolledParkingModel.hasMultipleBranches(),
      ).toBe(false);
    });

    it('should return false for hasMultipleBranches when hasBranches is true but numberOfBranches is 1', () => {
      expect(
        mockSingleBranchWithBranchesPreEnrolledParkingModel.hasMultipleBranches(),
      ).toBe(false);
    });
  });

  describe('getFullAddress', () => {
    it('should return full address correctly', () => {
      expect(parkingModel.getFullAddress()).toBe('123 Main St, Downtown');
    });
  });

  describe('isValidEmail', () => {
    it('should validate email format correctly for valid email', () => {
      expect(parkingModel.isValidEmail()).toBe(true);
    });

    it('should return false for invalid email format', () => {
      expect(mockInvalidEmailPreEnrolledParkingModel.isValidEmail()).toBe(
        false,
      );
    });

    it('should return false for email without domain', () => {
      expect(mockInvalidEmailDomainPreEnrolledParkingModel.isValidEmail()).toBe(
        false,
      );
    });
  });

  describe('isValidPhone', () => {
    it('should validate phone format correctly for valid phone', () => {
      expect(parkingModel.isValidPhone()).toBe(true);
    });

    it('should return false for phone with letters', () => {
      expect(
        mockInvalidPhoneLettersPreEnrolledParkingModel.isValidPhone(),
      ).toBe(false);
    });

    it('should return false for phone with more than 10 digits', () => {
      expect(mockInvalidPhoneLengthPreEnrolledParkingModel.isValidPhone()).toBe(
        false,
      );
    });

    it('should return true for phone with exactly 10 digits', () => {
      expect(mockValidPhonePreEnrolledParkingModel.isValidPhone()).toBe(true);
    });
  });

  describe('fromEntity', () => {
    it('should create from entity correctly', () => {
      const model = PreEnrolledParkingModel.fromEntity(mockEntityForFromEntity);

      expect(model.id).toBe(2);
      expect(model.legalRepresentative).toBe('Jane Smith');
      expect(model.nitDV).toBe('87654321-0');
      expect(model.phone).toBe('0987654321');
      expect(model.email).toBe('jane@example.com');
      expect(model.address).toBe('456 Oak Ave');
      expect(model.city).toBe(2);
      expect(model.neighborhood).toBe('Uptown');
      expect(model.hasBranches).toBe(false);
      expect(model.numberOfBranches).toBe(0);
      expect(model.companyName).toBe('Another Company');
      expect(model.documentType).toBe('NIT');
      expect(model.documentNumber).toBe('87654321');
      expect(model.idFiles).toBe(1);
      expect(model.isStatus).toBe(0);
      expect(model.internalId).toBe(null);
      expect(model.externalId).toBe('uuid-456');
    });
  });

  describe('toPlainObject', () => {
    it('should convert to plain object correctly', () => {
      const plainObject = parkingModel.toPlainObject();

      expect(plainObject).toEqual({
        id: 1,
        legalRepresentative: 'John Doe',
        nitDV: '12345678-9',
        phone: '1234567890',
        email: 'john@example.com',
        address: '123 Main St',
        city: 1,
        neighborhood: 'Downtown',
        hasBranches: true,
        numberOfBranches: 3,
        companyName: 'Test Company',
        documentType: 'CC',
        documentNumber: '12345678',
        idFiles: null,
        isStatus: 1,
        internalId: '123456',
        externalId: 'uuid-123',
      });
    });
  });
});
