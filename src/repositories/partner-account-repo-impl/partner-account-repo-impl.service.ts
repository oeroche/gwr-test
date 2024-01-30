import { Injectable } from '@nestjs/common';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool, sql } from 'slonik';
import { PartnerAccount } from '@/core/entities/PartnerAccount.entity';
import { PartnerAccountRepo } from '@/core/interfaces/repositories/PartnerAccountRepo';

@Injectable()
export class PartnerAccountRepoImplService implements PartnerAccountRepo {
  constructor(@InjectPool() private readonly _db: DatabasePool) {}
  async findOne(id: string): Promise<PartnerAccount> {
    const account = await this._db.one(
      sql.unsafe`SELECT * FROM "partnerAccount" WHERE id = ${id}`,
    );
    return account as PartnerAccount;
  }
  findAll(filter: { [x: string]: never }): Promise<PartnerAccount[]> {
    throw new Error('Method not implemented.');
  }
  create(entity: PartnerAccount): Promise<PartnerAccount> {
    throw new Error('Method not implemented.');
  }
  update(id: string, entity: PartnerAccount): Promise<PartnerAccount> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<PartnerAccount> {
    throw new Error('Method not implemented.');
  }
}
