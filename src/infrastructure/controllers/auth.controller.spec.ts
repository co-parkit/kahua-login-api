import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { ForgotPasswordUseCase } from '../../application/use-cases/forgot-password.use-case';
import { UserModel } from '../../domain/models/user.model';
import { LoginDto, ForgotPasswordDto } from '../../application/dtos/login.dto';
import { CreateUserDto } from '../../application/dtos/register.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let loginUseCase: jest.Mocked<LoginUseCase>;
  let registerUseCase: jest.Mocked<RegisterUseCase>;
  let forgotPasswordUseCase: jest.Mocked<ForgotPasswordUseCase>;

  beforeEach(async () => {
    const mockLoginUseCase = {
      execute: jest.fn(),
    };

    const mockRegisterUseCase = {
      execute: jest.fn(),
    };

    const mockForgotPasswordUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: mockLoginUseCase,
        },
        {
          provide: RegisterUseCase,
          useValue: mockRegisterUseCase,
        },
        {
          provide: ForgotPasswordUseCase,
          useValue: mockForgotPasswordUseCase,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    loginUseCase = module.get(LoginUseCase);
    registerUseCase = module.get(RegisterUseCase);
    forgotPasswordUseCase = module.get(ForgotPasswordUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // TODO: Implementar tests
  // - should login user successfully
  // - should register user successfully
  // - should handle forgot password request
  // - should call login use case with correct parameters
  // - should call register use case with correct parameters
  // - should call forgot password use case with correct parameters
  // - should return proper response format
  // - should handle errors from use cases
});
