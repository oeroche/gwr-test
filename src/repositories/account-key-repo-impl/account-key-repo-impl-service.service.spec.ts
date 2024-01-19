import { Test, TestingModule } from '@nestjs/testing';
import { AccountKeyRepoImplService } from './account-key-repo-impl-service.service';

describe('AccountKeyRepoImplServiceService', () => {
  let service: AccountKeyRepoImplService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountKeyRepoImplService],
    }).compile();

    service = module.get<AccountKeyRepoImplService>(AccountKeyRepoImplService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
