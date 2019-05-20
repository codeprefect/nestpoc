import { Module } from '@nestjs/common';
import { createConnection } from 'typeorm';

import { ConfigService } from './config.service';
import { databaseProviderKey, envProvider } from './constants';

export const databaseProvider = {
  provide: databaseProviderKey,
  useFactory: async (configService: ConfigService) => {
    return createConnection(configService.createDatabaseOpts());
  },
  inject: [ConfigService],
};

@Module({
  imports: [],
  providers: [
    ConfigService,
    envProvider,
    databaseProvider,
  ],
  exports: [
    ConfigService,
    envProvider,
    databaseProvider,
  ],
})
export class ConfigModule { }
