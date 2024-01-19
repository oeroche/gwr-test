import { Test, TestingModule } from '@nestjs/testing';
import { TravelInfoRepoImplService } from './travel-info-repo-impl.service';

describe('TravelInfoRepoImplService', () => {
  let service: TravelInfoRepoImplService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TravelInfoRepoImplService],
    }).compile();

    service = module.get<TravelInfoRepoImplService>(TravelInfoRepoImplService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
