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

  describe('preEnroll', () => {
    it('should pre-enroll parking successfully', async () => {
      const preSignUpDto: PreSignUpParkingDto = {
        email: 'test@test.com',
        legalRepresentative: 'John Doe',
        companyName: 'Test Company',
        hasBranches: false,
        numberOfBranches: 0,
        nitDV: '12345678-9',
        phone: '1234567890',
        address: 'Test Address',
        city: 1,
        neighborhood: 'Test Neighborhood',
        documentType: 'CC',
        documentNumber: '12345678',
      };

      const mockParking = {
        id: 1,
        email: 'test@test.com',
        legalRepresentative: 'John Doe',
        companyName: 'Test Company',
        hasBranches: false,
        numberOfBranches: 0,
        nitDV: '12345678-9',
        phone: '1234567890',
        address: 'Test Address',
        city: 1,
        neighborhood: 'Test Neighborhood',
        documentType: 'CC',
        documentNumber: '12345678',
        idFiles: null,
        isStatus: 1,
        externalId: 'ext-123',
        internalId: null,
      } as any;

      preEnrollParkingUseCase.execute.mockResolvedValue(mockParking);

      const result = await controller.preEnroll(preSignUpDto);

      expect(result).toEqual({
        legalRepresentative: 'John Doe',
        companyName: 'Test Company',
        externalId: 'ext-123',
        internalId: null,
      });
    });

    it('should call pre-enroll parking use case with correct parameters', async () => {
      const preSignUpDto: PreSignUpParkingDto = {
        email: 'test@test.com',
        legalRepresentative: 'John Doe',
        companyName: 'Test Company',
        hasBranches: false,
        numberOfBranches: 0,
        nitDV: '12345678-9',
        phone: '1234567890',
        address: 'Test Address',
        city: 1,
        neighborhood: 'Test Neighborhood',
        documentType: 'CC',
        documentNumber: '12345678',
      };

      const mockParking = {
        id: 1,
        email: 'test@test.com',
        legalRepresentative: 'John Doe',
        companyName: 'Test Company',
        hasBranches: false,
        numberOfBranches: 0,
        nitDV: '12345678-9',
        phone: '1234567890',
        address: 'Test Address',
        city: 1,
        neighborhood: 'Test Neighborhood',
        documentType: 'CC',
        documentNumber: '12345678',
        idFiles: null,
        isStatus: 1,
        externalId: 'ext-123',
        internalId: null,
      } as any;

      preEnrollParkingUseCase.execute.mockResolvedValue(mockParking);

      await controller.preEnroll(preSignUpDto);

      expect(preEnrollParkingUseCase.execute).toHaveBeenCalledWith(
        preSignUpDto,
      );
    });

    it('should return proper response format', async () => {
      const preSignUpDto: PreSignUpParkingDto = {
        email: 'test@test.com',
        legalRepresentative: 'John Doe',
        companyName: 'Test Company',
        hasBranches: true,
        numberOfBranches: 5,
        internalId: 'int-456',
        nitDV: '12345678-9',
        phone: '1234567890',
        address: 'Test Address',
        city: 1,
        neighborhood: 'Test Neighborhood',
        documentType: 'CC',
        documentNumber: '12345678',
      };

      const mockParking = {
        id: 1,
        email: 'test@test.com',
        legalRepresentative: 'John Doe',
        companyName: 'Test Company',
        hasBranches: true,
        numberOfBranches: 5,
        nitDV: '12345678-9',
        phone: '1234567890',
        address: 'Test Address',
        city: 1,
        neighborhood: 'Test Neighborhood',
        documentType: 'CC',
        documentNumber: '12345678',
        idFiles: null,
        isStatus: 1,
        externalId: null,
        internalId: 'int-456',
      } as any;

      preEnrollParkingUseCase.execute.mockResolvedValue(mockParking);

      const result = await controller.preEnroll(preSignUpDto);

      expect(result).toHaveProperty('legalRepresentative');
      expect(result).toHaveProperty('companyName');
      expect(result).toHaveProperty('externalId');
      expect(result).toHaveProperty('internalId');
      expect(result.legalRepresentative).toBe('John Doe');
      expect(result.companyName).toBe('Test Company');
      expect(result.externalId).toBeNull();
      expect(result.internalId).toBe('int-456');
    });

    it('should handle errors from use case', async () => {
      const preSignUpDto: PreSignUpParkingDto = {
        email: 'test@test.com',
        legalRepresentative: 'John Doe',
        companyName: 'Test Company',
        hasBranches: false,
        numberOfBranches: 0,
        nitDV: '12345678-9',
        phone: '1234567890',
        address: 'Test Address',
        city: 1,
        neighborhood: 'Test Neighborhood',
        documentType: 'CC',
        documentNumber: '12345678',
      };

      const error = new Error('Email already exists');
      preEnrollParkingUseCase.execute.mockRejectedValue(error);

      await expect(controller.preEnroll(preSignUpDto)).rejects.toThrow(
        'Email already exists',
      );
    });
  });
});
