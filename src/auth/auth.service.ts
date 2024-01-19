import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool, sql } from 'slonik';
import { User } from '../domain/entities/User.entity';
import { generateAccountKey } from '../domain/usecases/generateAccountKey.usecase';
import { UserRepoImplService } from '../repositories/user-repo-impl/user-repo-impl.service';
import { AccountKeyRepoImplService } from '../repositories/account-key-repo-impl/account-key-repo-impl-service.service';
import { PartnerAccountRepoImplService } from '../repositories/partner-account-repo-impl/partner-account-repo-impl.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly _accountKeyRepo: AccountKeyRepoImplService,
    private readonly _userRepo: UserRepoImplService,
    private readonly _partnerAccountRepo: PartnerAccountRepoImplService,
    @InjectPool() private readonly _db: DatabasePool,
  ) {}

  async loginUser(email: string, password: string): Promise<User> {
    const user = await this._db.one(
      sql.unsafe`SELECT * FROM users WHERE email = ${email}`,
    );
    if (!user) {
      throw new Error('user not found');
    }
    if (user.password !== password) {
      throw new Error('wrong password');
    }
    const { password: _, ...result } = user;
    return result;
  }

  async generateApiKey(userId: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const accountKey = generateAccountKey({
      accountKeyRepo: this._accountKeyRepo,
      userRepo: this._userRepo,
      partnerAccountRepo: this._partnerAccountRepo,
      generateKey: () => Math.floor(1000000 * Math.random()).toString(),
      encryption: (key) => bcrypt.hash(key, salt),
    })({ userId });
    return accountKey;
  }
}
