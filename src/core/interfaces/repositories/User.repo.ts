import { User } from '@/core/entities/User.entity';
import { BaseRepo } from './base.repo';

export abstract class UserRepo extends BaseRepo<User, UserFilters> {}

export type UserFilters = {
  email?: string;
};
