import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AccountKeyGuard } from '../account-key.guard';
import { TravelInfoDto } from './dtos/partners.in.dto';
import { Request } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { PartnersService } from './partners.service';
import { Public } from '@/auth.guard';

@Controller('partners')
export class PartnersController {
  constructor(private readonly _partnersService: PartnersService) {}

  @ApiOperation({
    summary: 'Send customer travel info',
  })
  @Public()
  @UseGuards(AccountKeyGuard)
  @Post('travelInfo')
  async travelInfo(
    @Body() travelInfoDto: TravelInfoDto,
    @Req() req: Request & { partnerId: string },
  ) {
    await this._partnersService.recordTravelInfo(
      travelInfoDto.toTravelInfoEntity(req.partnerId),
    );
    return { data: 'ok' };
  }
}
