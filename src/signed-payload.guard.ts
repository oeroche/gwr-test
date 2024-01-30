import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AccountKeyRepoImplService } from './repositories/account-key-repo-impl/account-key-repo-impl-service.service';
import * as crypto from 'crypto';

const DELTA_TIME_MS = 60 * 1000;

@Injectable()
export class SignedPayloadGuard implements CanActivate {
  constructor(private readonly _acccountKeyRepo: AccountKeyRepoImplService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accountKey = atob(request.headers['account-key']);
    const now = Date.now();

    if (!accountKey) {
      return false;
    }
    const [id, key] = accountKey.split('_');

    if (!id || !key) {
      return false;
    }

    const signature = request.headers['x-signature'];
    const payload = request.body;
    const timestamp = request.headers['x-timestamp'];

    if (!signature || !payload || !timestamp) {
      throw new BadRequestException('missing signature, payload or timestamp');
    }

    const isTimestampValid = Math.abs(now - Number(timestamp)) < DELTA_TIME_MS;
    if (!isTimestampValid) {
      throw new BadRequestException('timestamp is not valid');
    }

    const { signSecret } = await this._acccountKeyRepo.findOne(id);
    const content = JSON.stringify({ payload, timestamp });
    const computedHash = crypto
      .createHmac('sha256', signSecret)
      .update(content)
      .digest('base64');

    if (signature !== computedHash) {
      return false;
    }

    return true;
  }
}
