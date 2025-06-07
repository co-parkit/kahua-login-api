import { Test, TestingModule } from '@nestjs/testing';
import { PreSignUpService } from './pre-sign-up-parking.service';

import { PreEnrolledParking } from '../../database/schema-pre-sing-up-parking.db';
import { mockEnrolledParkingModel } from '../../../../test/mocks/pre-enrolled-parking.mock';
import { PreSignUpParkingDto } from '../../dto/pre-sing-up-parking.dto';
import { CODES } from '../../../config/general.codes';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PreSignUpService', () => {
  let service: PreSignUpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreSignUpService,
        {
          provide: getRepositoryToken(PreEnrolledParking),
          useValue: mockEnrolledParkingModel,
        },
      ],
    }).compile();

    service = module.get<PreSignUpService>(PreSignUpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('preCreateParking', () => {
    it('should create a new parking and return formatted response', async () => {
      const dto: PreSignUpParkingDto = {
        legalRepresentative: 'Test Legal',
        nitDV: '123456789-1',
        phone: '3001234567',
        email: 'test@parking.com',
        address: '123 Calle Falsa',
        city: 1,
        neighborhood: 'Centro',
        hasBranches: false,
        numberOfBranches: 0,
        companyName: 'MockParking S.A.S.',
        documentType: 'CC',
        documentNumber: '987654321',
        internalId: '123456',
      };

      const response = await service.preCreateParking(dto);

      expect(response.code).toBe(CODES.PKL_PARKING_CREATE_OK.code);
      expect(response.data).toMatchObject({
        legal_representative: 'Test Legal',
        company_name: 'MockParking S.A.S.',
        external_id: expect.any(String),
        internal_id: '123456',
      });

      expect(mockEnrolledParkingModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          legalRepresentative: 'Test Legal',
          companyName: 'MockParking S.A.S.',
        }),
      );
    });
  });
});
