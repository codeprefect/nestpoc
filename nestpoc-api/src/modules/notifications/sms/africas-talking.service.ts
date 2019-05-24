import { Injectable } from '@nestjs/common';
import { ConfigService, NestPocException } from '@nestpoc/common';
import * as africastalking from 'africastalking';

import { ISmsModel, ISmsSender } from './sms-sender.interface';

@Injectable()
export class AfricasTalkingService implements ISmsSender {
  private readonly sms: any;
  private readonly senderId: string;
  constructor(configService: ConfigService) {
    const credentials = configService.createAfricasTalkingOptions();
    if (credentials != null) {
      this.senderId = credentials.defaultSender;
      this.sms = africastalking(credentials.options).SMS;
    }
  }

  public async send(message: ISmsModel, from?: string): Promise<boolean> {
    try {
      const msg = {
        from: from || this.senderId,
        ...message,
      };
      await this.sms.send(msg);
      return true;
    } catch (err) {
      throw new NestPocException(`failed to send sms, \n ${err.message}`, 500);
    }
  }
}
