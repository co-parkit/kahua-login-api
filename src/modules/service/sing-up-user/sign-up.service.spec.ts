import { Test, TestingModule } from '@nestjs/testing';
import { SignUpService } from './sign-up.service';
import { User } from '../../database/schema-user.db';
import { mockUserModel } from '../../../../test/mocks/user.model.mock';
import { mockLogger, mockData } from '../../../../test/mocks/sign-up-mock';
import { CODES } from '../../../config/general.codes';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MyLogger } from '../../../config/logger';

describe('SignUpService', () => {
  let service: SignUpService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserModel,
        },
        {
          provide: MyLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<SignUpService>(SignUpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should return PKL_USER_EMAIL_EXIST if email already exists', async () => {
      mockUserModel.findOne = jest.fn().mockResolvedValueOnce({
        email: mockData.email,
        userName: 'another_user',
      });

      const response = await service.createUser(mockData);

      expect(response.code).toBe(CODES.PKL_USER_EMAIL_EXIST.code);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: [{ email: mockData.email }, { userName: mockData.user_name }],
      });
    });

    it('should return PKL_USER_NAME_EXIST if user_name already exists', async () => {
      mockUserModel.findOne = jest.fn().mockResolvedValueOnce({
        email: 'another_email@example.com',
        userName: mockData.user_name,
      });

      const response = await service.createUser(mockData);

      expect(response.code).toBe(CODES.PKL_USER_NAME_EXIST.code);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: [{ email: mockData.email }, { userName: mockData.user_name }],
      });
    });

    it('should create user and return PKL_USER_CREATE_OK', async () => {
      mockUserModel.findOne = jest.fn().mockResolvedValue(null);
      mockUserModel.create = jest.fn().mockImplementation((data) => ({
        ...data,
        id: 1,
      }));
      mockUserModel.save = jest.fn().mockResolvedValue({
        id: 1,
        email: mockData.email,
        userName: mockData.user_name,
        password: 'hashedPassword',
      });

      const response = await service.createUser(mockData);

      expect(response.code).toBe(CODES.PKL_USER_CREATE_OK.code);
      expect(response.data.userId).toEqual({
        id: 1,
        email: mockData.email,
        userName: mockData.user_name,
        password: 'hashedPassword',
      });
      expect(mockUserModel.create).toHaveBeenCalled();
      expect(mockUserModel.save).toHaveBeenCalled();
    });
  });
});
