import { Test, TestingModule } from '@nestjs/testing';
import { SignUpController } from './sign-up.controller';
import { SignUpService } from '../../service/sing-up-user/sign-up.service';
import { CreateUserDto } from '../../dto/sing-up-user.dto';

describe('SignUpController', () => {
  let controller: SignUpController;
  let service: SignUpService;

  const mockSignUpService = {
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignUpController],
      providers: [
        {
          provide: SignUpService,
          useValue: mockSignUpService,
        },
      ],
    }).compile();

    controller = module.get<SignUpController>(SignUpController);
    service = module.get<SignUpService>(SignUpService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should call signUpService.createUser and return result', async () => {
      const dto: CreateUserDto = {
        email: 'mock@user.com',
        password: '123456',
        name: 'Mock',
        last_name: 'User',
        phone: '3000000000',
        user_name: 'mockuser',
        id_role: 1,
      };

      const mockResponse = {
        code: 'PKL_USER_CREATE_OK',
        data: { email: dto.email },
      };

      mockSignUpService.createUser.mockResolvedValue(mockResponse);

      const result = await controller.create(dto);

      expect(service.createUser).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResponse);
    });
  });
});
