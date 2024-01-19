import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RepositoriesModule } from '../repositories/repositories.module';
import { AuthService } from './auth.service';

@Module({
  imports: [RepositoriesModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
