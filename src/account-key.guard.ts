import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AccountKeyRepoImplService } from './repositories/account-key-repo-impl/account-key-repo-impl-service.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountKeyGuard implements CanActivate {
  constructor(private readonly _accountKeyRepo: AccountKeyRepoImplService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const accountKey = this.getAccountKey(context);
      const request = context.switchToHttp().getRequest();
      if (!accountKey) {
        return false;
      }
      const [id, key] = accountKey.split('_');

      if (!id || !key) {
        return false;
      }
      const accountKeyEntity = await this._accountKeyRepo.findOne(id);
      const result = await bcrypt.compare(key, accountKeyEntity.encryptedKey);
      if (result) {
        request['partnerId'] = accountKeyEntity.PartnerAccountId;
      }
      return result;
    } catch (e) {
      return false;
    }
  }

  getAccountKey(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    return request.headers['account-key'];
  }
}
