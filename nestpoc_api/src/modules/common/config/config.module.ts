import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config.service';
import { envProvider } from './constants';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useExisting: ConfigService,
    }),
  ],
  providers: [ConfigService, envProvider],
  exports: [ConfigService, envProvider],
})
export class ConfigModule {}
