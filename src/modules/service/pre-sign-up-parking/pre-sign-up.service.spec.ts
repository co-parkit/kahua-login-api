import { Test, TestingModule } from '@nestjs/testing';
import { PreSignUpService } from './pre-sign-up-parking.service';
import { getModelToken } from '@nestjs/sequelize';
import { PreEnrolledParking } from '../../database/schema-pre-sing-up-parking.db';
import { mockEnrolledParkingModel } from '../../../../test/mocks/pre-enrolled-parking.mock';
import { PreSignUpParkingDto } from '../../dto/pre-sing-up-parking.dto';
import { CODES } from '../../../config/general.codes';

describe('PreSignUpService', () => {
  let service: PreSignUpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreSignUpService,
        {
          provide: getModelToken(PreEnrolledParking),
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
        legal_representative: 'Test Legal',
        nit_DV: '123456789-1',
        phone: '3001234567',
        email: 'test@parking.com',
        address: '123 Calle Falsa',
        city: 1,
        neighborhood: 'Centro',
        has_branches: false,
        number_of_branches: 0,
        company_name: 'MockParking S.A.S.',
        document_type: 'CC',
        document_number: '987654321',
        internal_id: '123456',
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
          legal_representative: 'Test Legal',
          company_name: 'MockParking S.A.S.',
        }),
      );
    });
  });
});
