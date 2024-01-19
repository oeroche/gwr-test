import { EntityBase } from './base.entity';

export type TravelInfo = EntityBase & {
  clientInformation: ClientInformation;
  travelDetails: TravelDetails;
  partnerAccountId: string;
};

export type ClientInformation = {
  email: string;
  language: string;
  countryOfOrigin: string;
  countryOfDestination: string;
};

export type TravelDetails = {
  travelStartDate: Date;
  travelEndDate: Date;
};
