import {
  Body,
  Controller,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto } from './dtos/auth.in.dtos';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../auth.guard';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/domain/entities/User.entity';
import { GenerateApiKeyOutDto, LoginOutDto } from './dtos/auth.out.dtos';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _jwtService: JwtService,
  ) {}

  @ApiOperation({
    summary: 'login request',
  })
  @ApiResponse({
    status: 200,
    description: 'login successful',
    type: LoginOutDto,
  })
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginOutDto> {
    const user = await this._authService.loginUser(
      loginDto.email,
      loginDto.password,
    );
    const token = await this._jwtService.signAsync({
      userId: user.id,
    });
    return { user, token };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Generates an api key to be used in order to send data',
  })
  @ApiResponse({
    status: 200,
    description: 'api key generated successfully',
    type: GenerateApiKeyOutDto,
  })
  @Post('generateApiKey')
  async generateApiKey(@Req() req) {
    try {
      // this is a write op if we want cqrs
      const accountKey = await this._authService.generateApiKey(
        req.user.userId,
      );
      return { accountKey };
    } catch (e) {
      throw e;
    }
  }
}
