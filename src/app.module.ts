import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PartnersModule } from './partners/partners.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { RepositoriesModule } from './repositories/repositories.module';
import { JwtModule } from '@nestjs/jwt';
import { authConfig } from './common/config';
import { DbModule } from './datasources/db/db.module';

@Module({
  imports: [
    DbModule,
    AuthModule,
    PartnersModule,
    RepositoriesModule,
    JwtModule.register({
      global: true,
      secret: authConfig.jwt.secret,
      signOptions: { expiresIn: '1y' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
