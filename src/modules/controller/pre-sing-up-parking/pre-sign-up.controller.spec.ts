import { Test, TestingModule } from '@nestjs/testing';
import { PreSignUpController } from './pre-sign-up.controller';
import { PreSignUpService } from '../../service/pre-sign-up-parking/pre-sign-up-parking.service';
import { PreSignUpParkingDto } from '../../dto/pre-sing-up-parking.dto';

describe('PreSignUpController', () => {
  let controller: PreSignUpController;
  let service: PreSignUpService;

  const mockPreSignUpService = {
    preCreateParking: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreSignUpController],
      providers: [
        {
          provide: PreSignUpService,
          useValue: mockPreSignUpService,
        },
      ],
    }).compile();

    controller = module.get<PreSignUpController>(PreSignUpController);
    service = module.get<PreSignUpService>(PreSignUpService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should call service with DTO and return response', async () => {
      const dto: PreSignUpParkingDto = {
        legalRepresentative: 'Test Legal',
        nitDV: '123456789-1',
        phone: '3001234567',
        email: 'test@parking.com',
        address: 'Calle 123',
        city: 1,
        neighborhood: 'Centro',
        hasBranches: false,
        numberOfBranches: 0,
        companyName: 'MockParking S.A.S.',
        documentType: 'CC',
        documentNumber: '123456789',
        internalId: '123456',
      };

      const mockResponse = { code: 'PKL_PARKING_CREATE_OK', data: dto };
      mockPreSignUpService.preCreateParking.mockResolvedValue(mockResponse);

      const result = await controller.create(dto);

      expect(service.preCreateParking).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResponse);
    });
  });
});
