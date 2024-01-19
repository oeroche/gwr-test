import { Module } from '@nestjs/common';
import { UserRepoImplService } from './user-repo-impl/user-repo-impl.service';
import { PartnerAccountRepoImplService } from './partner-account-repo-impl/partner-account-repo-impl.service';
import { AccountKeyRepoImplService } from './account-key-repo-impl/account-key-repo-impl-service.service';
import { TravelInfoRepoImplService } from './travel-info-repo-impl/travel-info-repo-impl.service';

@Module({
  providers: [
    UserRepoImplService,
    AccountKeyRepoImplService,
    PartnerAccountRepoImplService,
    TravelInfoRepoImplService,
  ],
  exports: [
    UserRepoImplService,
    AccountKeyRepoImplService,
    PartnerAccountRepoImplService,
    TravelInfoRepoImplService,
  ],
})
export class RepositoriesModule {}
