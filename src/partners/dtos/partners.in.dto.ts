import {
  IsDate,
  IsDateString,
  IsEmail,
  IsISO31661Alpha2,
  Validate,
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { TravelInfo } from '@/core/entities/TravelInfo.entity';
import isLang from 'validator/lib/isISO6391';

@ValidatorConstraint({ name: 'IsLang', async: true })
class IsLangValidator implements ValidatorConstraintInterface {
  validate(value: string) {
    try {
      return isLang(value);
    } catch (e) {
      return false;
    }
  }
  defaultMessage() {
    return 'Language must be a valid ISO 639-1 language code';
  }
}

export class TravelInfoDto {
  @IsEmail()
  clientEmail: string;

  @Validate(IsLangValidator, {
    message: 'Language must be a valid ISO 639-1 language code',
  })
  clientLanguage: string;

  @IsISO31661Alpha2()
  countryOfOrigin: string;

  @IsISO31661Alpha2()
  countryOfDestination: string;

  @IsDateString()
  @Validate((p) => p > new Date(), {
    message: 'Travel start date cannot be in the past',
  })
  travelStartDate: Date;

  @IsDateString()
  @Validate((p) => p > new Date(), {
    message: 'Travel end date cannot be in the past',
  })
  travelEndDate: Date;

  toTravelInfoEntity(partnerId: string): Omit<TravelInfo, 'id' | 'hash'> {
    return {
      clientInformation: {
        email: this.clientEmail,
        language: this.clientLanguage,
        countryOfOrigin: this.countryOfOrigin,
        countryOfDestination: this.countryOfDestination,
      },
      travelDetails: {
        travelStartDate: new Date(this.travelStartDate),
        travelEndDate: new Date(this.travelEndDate),
      },
      partnerAccountId: partnerId,
    };
  }
}
