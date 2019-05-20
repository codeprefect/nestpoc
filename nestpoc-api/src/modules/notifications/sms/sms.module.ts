import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestpoc/common';

import { AfricasTalkingService } from './africas-talking.service';
import { TwilioService } from './twilio.service';

@Module({
  providers: [
    AfricasTalkingService,
    TwilioService,
  ],
  imports: [
    ConfigModule,
  ],
  exports: [
    AfricasTalkingService,
    TwilioService,
  ],
})
export class SmsModule { }
