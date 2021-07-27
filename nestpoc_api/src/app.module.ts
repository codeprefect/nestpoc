import { Module } from '@nestjs/common';
import { GatewayModule } from '@nestpoc/gateway';

@Module({
  imports: [GatewayModule],
})
export class AppModule {}
