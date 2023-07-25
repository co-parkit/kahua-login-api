import { Test, TestingModule } from '@nestjs/testing';
import { SingUpService } from './sing-up.service';

describe('SingUpService', () => {
  let service: SingUpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SingUpService],
    }).compile();

    service = module.get<SingUpService>(SingUpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
