import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestpoc/common';
import { smsProvider, smsProviders } from './constants';
import { AfricasTalkingService, ISmsProvider, ISmsSender, TwilioService } from './sms';
import { SmsModule } from './sms/sms.module';

const sms = {
  provide: smsProvider,
  useFactory: async (config: ConfigService): Promise<ISmsProvider> => {
    return (key): ISmsSender => {
      switch (key) {
        case smsProviders.twilio:
          return new TwilioService(config);
          break;
        default:
          return new AfricasTalkingService(config);
      }
    };
  },
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [
    SmsModule,
  ],
  providers: [
    sms,
  ],
  exports: [
    sms,
  ],
})
export class NotificationsModule { }
