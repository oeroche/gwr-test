import { BadRequestException, Injectable } from '@nestjs/common';
import { TravelInfo } from '@/core/entities/TravelInfo.entity';
import { RecordTravelInfoUseCase } from '@/core/usecases/recordTravelInfo.usecase';
import { TravelInfoRepoImplService } from '@/repositories/travel-info-repo-impl/travel-info-repo-impl.service';

@Injectable()
export class PartnersService {
  private readonly recordTravelInfoUseCase: RecordTravelInfoUseCase;
  constructor(private readonly _travelInfoRepo: TravelInfoRepoImplService) {
    this.recordTravelInfoUseCase = new RecordTravelInfoUseCase({
      travelInfoRepo: this._travelInfoRepo,
    });
  }

  async recordTravelInfo(
    travelInfoEntity: Omit<TravelInfo, 'id'>,
  ): Promise<TravelInfo> {
    try {
      const entity = await this.recordTravelInfoUseCase.execute({
        travelInfo: travelInfoEntity,
      });
      return entity;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
