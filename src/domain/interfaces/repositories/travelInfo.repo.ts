import { TravelInfo } from '../../entities/TravelInfo.entity';
import { BaseRepo } from './base.repo';

export abstract class TravelInfoRepo extends BaseRepo<
  TravelInfo,
  TravelInfoFilters
> {}

export type TravelInfoFilters = {
  partnerId?: string;
};
