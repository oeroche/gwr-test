import { Test, TestingModule } from '@nestjs/testing';
import { PartnerAccountRepoImplService } from './partner-account-repo-impl.service';

describe('PartnerAccountRepoImplService', () => {
  let service: PartnerAccountRepoImplService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerAccountRepoImplService],
    }).compile();

    service = module.get<PartnerAccountRepoImplService>(PartnerAccountRepoImplService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
