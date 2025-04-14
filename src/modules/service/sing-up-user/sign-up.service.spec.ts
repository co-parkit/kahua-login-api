import { Test, TestingModule } from '@nestjs/testing';
import { SignUpService } from './sign-up.service';
import { getModelToken } from '@nestjs/sequelize';
import { Users } from '../../database/schema-user.db';
import { mockUserModel } from '../../../../test/mocks/user.model.mock';
import { CODES } from '../../../config/general.codes';

describe('SignUpService', () => {
  let service: SignUpService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpService,
        {
          provide: getModelToken(Users),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<SignUpService>(SignUpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    const mockData = {
      email: 'test@example.com',
      password: 'plainpass',
      user_name: 'testuser',
    };

    it('should return PKL_USER_EMAIL_EXIST if email already exists', async () => {
      mockUserModel.findOne = jest.fn().mockResolvedValueOnce(true);

      const response = await service.createUser(mockData);

      expect(response.code).toBe(CODES.PKL_USER_EMAIL_EXIST.code);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: { email: mockData.email },
      });
    });

    it('should return PKL_USER_NAME_EXIST if username already exists', async () => {
      mockUserModel.findOne = jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(true);

      const response = await service.createUser(mockData);

      expect(response.code).toBe(CODES.PKL_USER_NAME_EXIST.code);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: { user_name: mockData.user_name },
      });
    });

    it('should create user and return PKL_USER_CREATE_OK', async () => {
      mockUserModel.findOne = jest.fn().mockResolvedValue(null);
      mockUserModel.create = jest.fn().mockResolvedValue(true);

      const response = await service.createUser(mockData);

      expect(response.code).toBe(CODES.PKL_USER_CREATE_OK.code);
      expect(response.data?.email).toBe(mockData.email);
      expect(typeof response.data?.password).toBe('string');
      expect(response.data.password).not.toBe(mockData.password);
      expect(mockUserModel.create).toHaveBeenCalled();
    });
  });
});
