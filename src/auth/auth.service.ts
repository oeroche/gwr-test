import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool, sql } from 'slonik';
import { User } from '../core/entities/User.entity';
import { GenerateAccountKeyAndSignSecretUseCase } from '../core/usecases/generateAccountKey.usecase';
import { UserRepoImplService } from '../repositories/user-repo-impl/user-repo-impl.service';
import { AccountKeyRepoImplService } from '../repositories/account-key-repo-impl/account-key-repo-impl-service.service';
import { PartnerAccountRepoImplService } from '../repositories/partner-account-repo-impl/partner-account-repo-impl.service';

@Injectable()
export class AuthService {
  private readonly generateAccountKeyAndSecretUseCase: GenerateAccountKeyAndSignSecretUseCase;
  constructor(
    private readonly _accountKeyRepo: AccountKeyRepoImplService,
    private readonly _userRepo: UserRepoImplService,
    private readonly _partnerAccountRepo: PartnerAccountRepoImplService,
    @InjectPool() private readonly _db: DatabasePool,
  ) {
    this.generateAccountKeyAndSecretUseCase =
      new GenerateAccountKeyAndSignSecretUseCase({
        accountKeyRepo: this._accountKeyRepo,
        userRepo: this._userRepo,
        partnerAccountRepo: this._partnerAccountRepo,
        generateKey: () => Math.floor(1000000 * Math.random()).toString(),
        generateSecret: () =>
          btoa(Math.floor(1000000 * Math.random()).toString()),
        encryption: async (key) => {
          const salt = await bcrypt.genSalt(10);
          return bcrypt.hash(key, salt);
        },
      });
  }

  async loginUser(email: string, password: string): Promise<User> {
    const user = await this._db.one(
      //TODO: move to usecase
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

  async generateApiKeyAndSignSecret(
    userId: string,
  ): Promise<{ accountKey: string; signSecret: string }> {
    const { accountKey, signSecret } =
      await this.generateAccountKeyAndSecretUseCase.execute({
        userId,
      });
    return { accountKey, signSecret };
  }
}
