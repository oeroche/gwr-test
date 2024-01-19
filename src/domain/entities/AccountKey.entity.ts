import { EntityBase } from './base.entity';

export type AccountKey = EntityBase & {
  encryptedKey: string;
  PartnerAccountId: string;
};
