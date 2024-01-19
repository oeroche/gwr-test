import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool, sql } from 'slonik';
import { AccountKey } from '@/domain/entities/AccountKey.entity';
import { AccountKeyRepo } from '@/domain/interfaces/repositories/accountKey.repo';
import z from 'zod';

const AccountKeyRowObject = z.object({
  id: z.string(),
  encrypted_key: z.string(),
  PartnerAccountId: z.string(),
  created_at: z.date(),
});

type AccountKeyRow = z.infer<typeof AccountKeyRowObject>;

@Injectable()
export class AccountKeyRepoImplService implements AccountKeyRepo {
  constructor(@InjectPool() private readonly _db: DatabasePool) {}
  async findOne(id: string): Promise<AccountKey> {
    try {
      const result = await this._db.one(
        sql.type(
          AccountKeyRowObject,
        )`SELECT * FROM "AccountKey" WHERE "id" = ${id}`,
      );
      return this._mapRowToEntity(result);
    } catch (e) {
      throw new NotFoundException('AccountKey not found');
    }
  }
  async findByAccountHash(accountHash: string): Promise<AccountKey> {
    try {
      const result = await this._db.one(
        sql.unsafe`SELECT * FROM "AccountKey" WHERE "encryptedKey" = ${accountHash}`,
      );
      return result;
    } catch (e) {
      throw new NotFoundException('AccountKey not found');
    }
  }
  findAll(filter: { partnerId?: string }): Promise<AccountKey[]> {
    throw new Error('Method not implemented.');
  }
  async create(entity: AccountKey): Promise<AccountKey> {
    const accountKey = await this._db.one(
      sql.unsafe`INSERT INTO "AccountKey" VALUES (DEFAULT, DEFAULT, ${entity.encryptedKey}, ${entity.PartnerAccountId}) RETURNING *`,
    );
    return accountKey as AccountKey;
  }
  update(id: string, entity: AccountKey): Promise<AccountKey> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<AccountKey> {
    throw new Error('Method not implemented.');
  }

  private _mapRowToEntity(row: AccountKeyRow): AccountKey {
    return {
      id: row.id,
      encryptedKey: row.encrypted_key,
      PartnerAccountId: row.PartnerAccountId,
    };
  }
}
