import { BadRequestException, Injectable } from '@nestjs/common';
import { TravelInfo } from '@domain/entities/TravelInfo.entity';
import { recordTravelInfo } from '@domain/usecases/recordTravelInfo.usecase';
import { TravelInfoRepoImplService } from '@/repositories/travel-info-repo-impl/travel-info-repo-impl.service';

@Injectable()
export class PartnersService {
  constructor(private readonly _travelInfoRepo: TravelInfoRepoImplService) {}

  async recordTravelInfo(
    travelInfoEntity: Omit<TravelInfo, 'id'>,
  ): Promise<TravelInfo> {
    try {
      const entity = await recordTravelInfo({
        travelInfoRepo: this._travelInfoRepo,
      })({ travelInfo: travelInfoEntity });
      return entity;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
