import { TravelInfo } from '../entities/TravelInfo.entity';
import { TravelInfoRepo } from '../interfaces/repositories/travelInfo.repo';
import { RecordTravelInfoUseCase } from './recordTravelInfo.usecase';

describe('Record Travel Info Use Case', () => {
  const travelInfoInit: Omit<TravelInfo, 'id'> = {
    partnerAccountId: 'any',
    clientInformation: {
      countryOfDestination: 'France',
      countryOfOrigin: 'France',
      email: 'any@any.com',
      language: 'English',
    },
    travelDetails: {
      travelEndDate: new Date('2025-12-12'),
      travelStartDate: new Date('2024-12-12'),
    },
    hash: 'hash',
  };

  let useCase: RecordTravelInfoUseCase;
  let travelInfoRepo: TravelInfoRepo;
  beforeEach(() => {
    travelInfoRepo = {
      create: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };
    useCase = new RecordTravelInfoUseCase({
      travelInfoRepo,
    });
  });

  it('should throw an error if travel start date is in the past', () => {
    expect(async () => {
      await useCase.execute({
        travelInfo: {
          ...travelInfoInit,
          travelDetails: {
            travelStartDate: new Date('2019-12-12'),
            travelEndDate: new Date('2020-12-12'),
          },
        },
      });
    }).rejects.toThrowError();
  });

  it('should throw an error if travel start date is after travel end date', () => {
    expect(async () => {
      await useCase.execute({
        travelInfo: {
          ...travelInfoInit,
          travelDetails: {
            travelStartDate: new Date('2020-12-12'),
            travelEndDate: new Date('2019-12-12'),
          },
        },
      });
    }).rejects.toThrowError();
  });

  it('should throw an error if email is empty', () => {
    expect(async () => {
      await useCase.execute({
        travelInfo: {
          ...travelInfoInit,
          clientInformation: {
            ...travelInfoInit.clientInformation,
            email: '',
          },
        },
      });
    }).rejects.toThrowError();
  });

  it('should throw an error if country of origin is empty', () => {
    expect(async () => {
      await useCase.execute({
        travelInfo: {
          ...travelInfoInit,
          clientInformation: {
            ...travelInfoInit.clientInformation,
            countryOfOrigin: '',
          },
        },
      });
    }).rejects.toThrowError();
  });

  it('should throw an error if country of destination is empty', () => {
    expect(async () => {
      await useCase.execute({
        travelInfo: {
          ...travelInfoInit,
          clientInformation: {
            ...travelInfoInit.clientInformation,
            countryOfDestination: '',
          },
        },
      });
    }).rejects.toThrowError();
  });

  it('should throw an error if language is empty', () => {
    expect(async () => {
      await useCase.execute({
        travelInfo: {
          ...travelInfoInit,
          clientInformation: {
            ...travelInfoInit.clientInformation,
            language: '',
          },
        },
      });
    }).rejects.toThrowError();
  });

  it('should call travelInfoRepo.create with the right parameters', async () => {
    await useCase.execute({
      travelInfo: travelInfoInit,
    });
    expect(travelInfoRepo.create).toHaveBeenCalledWith(travelInfoInit);
  });
});
