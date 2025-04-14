import { Test, TestingModule } from '@nestjs/testing';
import { SignInController } from './sign-in.controller';
import { SignInService } from '../../service/sing-in/sign-in.service';
import { Request } from 'express';
import {
  mockSignInService,
  mockUser,
} from '../../../../test/mocks/sign-in.mock';

describe('SignInController', () => {
  let controller: SignInController;
  let service: SignInService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignInController],
      providers: [
        {
          provide: SignInService,
          useValue: mockSignInService,
        },
      ],
    }).compile();

    controller = module.get<SignInController>(SignInController);
    service = module.get<SignInService>(SignInService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT token and user info', async () => {
      const mockRequest = {
        user: mockUser,
      } as Request;

      const result = await controller.login(mockRequest);

      expect(result).toEqual({
        access_token: 'fake-jwt-token',
        user: mockUser,
      });

      expect(service.generateJWT).toHaveBeenCalledWith(mockUser);
    });
  });
});
