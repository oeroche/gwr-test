import { AccountKey } from '@/domain/entities/AccountKey.entity';
import { BaseRepo } from './base.repo';

export abstract class AccountKeyRepo extends BaseRepo<
  AccountKey,
  AccountKeyFilters
> {
  findByAccountHash: (accountHash: string) => Promise<AccountKey>;
}

type AccountKeyFilters = {
  partnerId?: string;
};
