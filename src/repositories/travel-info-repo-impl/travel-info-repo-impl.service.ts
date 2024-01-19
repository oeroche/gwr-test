import { Injectable } from '@nestjs/common';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool, sql } from 'slonik';
import { TravelInfo } from '@domain/entities/TravelInfo.entity';
import {
  TravelInfoFilters,
  TravelInfoRepo,
} from '@/domain/interfaces/repositories/travelInfo.repo';

import { z } from 'zod';

const TravelInfoRowObject = z.object({
  id: z.string(),
  client_email: z.string(),
  language: z.string(),
  countryOfOrigin: z.string(),
  countryOfDestination: z.string(),
  travelStartDate: z.date(),
  travelEndDate: z.date(),
  partnerAccountId: z.string(),
});

type TravelInfoRow = z.infer<typeof TravelInfoRowObject>;

@Injectable()
export class TravelInfoRepoImplService implements TravelInfoRepo {
  constructor(@InjectPool() private readonly _db: DatabasePool) {}
  findOne(id: string): Promise<TravelInfo> {
    throw new Error('Method not implemented.');
  }
  findAll(filter: TravelInfoFilters): Promise<TravelInfo[]> {
    throw new Error('Method not implemented.');
  }
  async create(entity: Omit<TravelInfo, 'id'>): Promise<TravelInfo> {
    const result = await this._db.one(
      sql.type(
        TravelInfoRowObject,
      )`INSERT INTO "TravelInfo" VALUES (DEFAULT, DEFAULT, ${
        entity.clientInformation.email
      }, ${entity.clientInformation.language}, ${
        entity.clientInformation.countryOfOrigin
      }, ${
        entity.clientInformation.countryOfDestination
      }, ${entity.travelDetails.travelStartDate.toUTCString()}, ${entity.travelDetails.travelEndDate.toUTCString()}, ${
        entity.partnerAccountId
      }) RETURNING *`,
    );
    return this._mapRowToEntity(result);
  }
  update(id: string, entity: TravelInfo): Promise<TravelInfo> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<TravelInfo> {
    throw new Error('Method not implemented.');
  }

  private _mapRowToEntity(row: TravelInfoRow): TravelInfo {
    return {
      id: row.id,
      clientInformation: {
        email: row.client_email,
        language: row.language,
        countryOfOrigin: row.countryOfOrigin,
        countryOfDestination: row.countryOfDestination,
      },
      travelDetails: {
        travelStartDate: row.travelStartDate,
        travelEndDate: row.travelEndDate,
      },
      partnerAccountId: row.partnerAccountId,
    };
  }
}
