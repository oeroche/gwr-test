import { Test, TestingModule } from '@nestjs/testing';
import { UserRepoImplService } from './user-repo-impl.service';

describe('UserRepoImplService', () => {
  let service: UserRepoImplService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepoImplService],
    }).compile();

    service = module.get<UserRepoImplService>(UserRepoImplService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
