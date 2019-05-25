import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { NotificationsModule } from '@nestpoc/notifications';
import { RouterModule } from 'nest-router';
import { ConfigModule } from '../common/config/config.module';
import { ConfigService } from '../common/config/config.service';
import { AuthModule } from './auth/auth.module';
import { routes } from './gateway.routes.v1';

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    AuthModule,
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: ConfigService,
    }),
    NotificationsModule,
  ],
})
export class GatewayModule {}
