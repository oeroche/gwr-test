import {
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccountKeyGuard } from '../account-key.guard';
import { TravelInfoDto } from './dtos/partners.in.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { PartnersService } from './partners.service';
import { Public } from '@/auth.guard';
import { SignedPayloadGuard } from '@/signed-payload.guard';

@Controller('partners')
export class PartnersController {
  constructor(private readonly _partnersService: PartnersService) {}

  @ApiHeader({
    name: 'account-key',
    required: true,
    schema: {
      type: 'string',
    },
    description: 'account key generated with the /auth/generateApiKey endpoint',
  })
  @ApiHeader({
    name: 'x-timestamp',
    required: true,
    schema: {
      type: 'number',
    },
    description:
      'Timestamp of the request, a timestamp older than 60 seconds will be rejected',
  })
  @ApiHeader({
    name: 'x-signature',
    required: true,
    schema: {
      type: 'string',
    },
    description:
      'HMAC-SHA256 signature of a json object { payload: requestPayload, timestamp: requestTimeStamp} using the sign secret',
  })
  @Public()
  @UseGuards(AccountKeyGuard, SignedPayloadGuard)
  @Post('travels/record')
  async travelInfo(
    @Body() travelInfoDto: TravelInfoDto,
    @Req() req: Request & { partnerId: string },
    @Headers('x-signature') hash: string,
  ) {
    await this._partnersService.recordTravelInfo({
      ...travelInfoDto.toTravelInfoEntity(req.partnerId),
      hash,
    });
    return { data: 'ok' };
  }
}
