import { Global, Module } from '@nestjs/common';
import { SlonikModule } from 'nestjs-slonik';
import { postgresConfig } from '../../common/config';

@Global()
@Module({
  imports: [
    SlonikModule.forRoot({
      connectionUri: postgresConfig.connection,
    }),
  ],
  exports: [SlonikModule],
})
export class DbModule {}
