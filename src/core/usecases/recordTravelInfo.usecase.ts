import { TravelInfo } from '../entities/TravelInfo.entity';
import { TravelInfoRepo } from '../interfaces/repositories/travelInfo.repo';
import { UseCase } from './base.usecase';
export class RecordTravelInfoUseCase extends UseCase<
  {
    travelInfoRepo: TravelInfoRepo;
  },
  Promise<TravelInfo>
> {
  async execute({ travelInfo }: { travelInfo: Omit<TravelInfo, 'id'> }) {
    if (travelInfo.travelDetails.travelStartDate < new Date()) {
      throw new Error('Travel start date cannot be in the past');
    }

    if (
      travelInfo.travelDetails.travelStartDate >
      travelInfo.travelDetails.travelEndDate
    ) {
      throw new Error('Travel start date cannot be after travel end date');
    }

    if (travelInfo.clientInformation.email === '') {
      throw new Error('Email cannot be empty');
    }

    if (travelInfo.clientInformation.countryOfOrigin === '') {
      throw new Error('Country of origin cannot be empty');
    }

    if (travelInfo.clientInformation.countryOfDestination === '') {
      throw new Error('Country of destination cannot be empty');
    }

    if (travelInfo.clientInformation.language === '') {
      throw new Error('Language cannot be empty');
    }

    return this.deps.travelInfoRepo.create(travelInfo);
  }
}
