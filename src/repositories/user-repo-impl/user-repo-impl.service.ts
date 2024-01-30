import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool, sql } from 'slonik';
import { User } from '@/core/entities/User.entity';
import {
  UserFilters,
  UserRepo,
} from '@/core/interfaces/repositories/User.repo';

@Injectable()
export class UserRepoImplService implements UserRepo {
  constructor(@InjectPool() private readonly _db: DatabasePool) {}
  async findOne(id: string): Promise<User> {
    try {
      const user = await this._db.one(
        sql.unsafe`SELECT * FROM users WHERE id = ${id}`,
      );

      return user as User;
    } catch (e) {
      throw new NotFoundException('User not found');
    }
  }
  $;
  // other methods not in the scope of this test
  findAll(filter: UserFilters): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  create(entity: User): Promise<User> {
    throw new Error('Method not implemented.');
  }
  update(id: string, entity: User): Promise<User> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
