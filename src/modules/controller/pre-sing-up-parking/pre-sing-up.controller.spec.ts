import { Test, TestingModule } from '@nestjs/testing';
import { PreSingUpController } from './pre-sing-up.controller';

describe('PreSingUpController', () => {
  let controller: PreSingUpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreSingUpController],
    }).compile();

    controller = module.get<PreSingUpController>(PreSingUpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
