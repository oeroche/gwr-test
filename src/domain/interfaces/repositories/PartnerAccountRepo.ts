import { PartnerAccount } from '@/domain/entities/PartnerAccount.entity';
import { BaseRepo } from './base.repo';

export abstract class PartnerAccountRepo extends BaseRepo<
  PartnerAccount,
  PartnerAccountFilters
> {}

type PartnerAccountFilters = Record<string, never>;
