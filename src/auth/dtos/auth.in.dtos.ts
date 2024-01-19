import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class generateApiKeyDto {
  @IsDate()
  @IsOptional()
  @ApiProperty()
  expriresAt: Date;
}
