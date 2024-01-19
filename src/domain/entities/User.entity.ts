import { EntityBase } from './base.entity';

export type User = EntityBase & {
  email: string;
  partnerAccountId: string;
  password: string;
};
