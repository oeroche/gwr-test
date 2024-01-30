import { Test, TestingModule } from '@nestjs/testing';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AccountKeyGuard } from '@/account-key.guard';
import { AccountKeyRepoImplService } from '@/repositories/account-key-repo-impl/account-key-repo-impl-service.service';

describe('PartnersController', () => {
  let controller: PartnersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnersController],
      providers: [
        JwtModule,
        {
          provide: PartnersService,
          useValue: {
            recordTravelInfo: jest.fn(),
          },
        },
        {
          provide: AccountKeyRepoImplService,
          useValue: {},
        },
        AccountKeyGuard,
        JwtService,
      ],
    }).compile();

    controller = module.get<PartnersController>(PartnersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service', async () => {
    await controller.travelInfo(
      { toTravelInfoEntity: () => ({}) } as any,
      {} as any,
      'hash',
    );
    expect(
      (controller as any)._partnersService.recordTravelInfo,
    ).toHaveBeenCalled();
  });
});
