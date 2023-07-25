import { Test, TestingModule } from '@nestjs/testing';
import { SingUpController } from './sing-up.controller';

describe('SingUpController', () => {
  let controller: SingUpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SingUpController],
    }).compile();

    controller = module.get<SingUpController>(SingUpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
