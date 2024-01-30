import { User } from '@/core/entities/User.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserDto implements Omit<User, 'password'> {
  @ApiProperty({
    description: 'Partner Account Id',
  })
  partnerAccountId: string;

  @IsString()
  @ApiProperty({
    description: 'User Id',
  })
  id: string;

  @IsEmail()
  @ApiProperty({
    description: 'User email',
  })
  email: string;
}

export class LoginOutDto {
  @IsString()
  @ApiProperty({
    description: 'JWT token',
  })
  token: string;

  @ApiProperty({
    example: {
      id: '1',
      email: 'user@email.com',
      partnerAccountId: '1',
    },
    description: 'User object',
  })
  user: UserDto;
}

export class GenerateApiKeyOutDto {
  @IsString()
  @ApiProperty({
    description: 'API Key',
  })
  accountKey: string;

  @IsString()
  @ApiProperty({
    description: 'Sign Secret, used to sign payloads',
  })
  signSecret: string;
}
