import { Test, TestingModule } from '@nestjs/testing';
import { PreSingUpService } from './pre-sing-up-parking.service';

describe('PreSingUpService', () => {
  let service: PreSingUpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreSingUpService],
    }).compile();

    service = module.get<PreSingUpService>(PreSingUpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
