import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestpoc/common';
import * as twilio from 'twilio';
import {
  MessageListInstance,
  MessageListInstanceCreateOptions,
} from 'twilio/lib/rest/api/v2010/account/message';
import { ISmsModel, ISmsSender } from './sms-sender.interface';

@Injectable()
export class TwilioService implements ISmsSender {
  private readonly defaultSender: string;
  public sms: MessageListInstance;

  constructor(config: ConfigService) {
    const options = config.createTwilioOptions();
    if (options != null) {
      this.sms = twilio(options.accountSid, options.authToken).messages;
      this.defaultSender = options.sender;
    }
  }

  public async send(message: ISmsModel, from?: string): Promise<boolean> {
    try {
      await Promise.all(
        message.to.map((receiver) => {
          const msg: MessageListInstanceCreateOptions = {
            to: receiver,
            body: message.message,
            from: this.defaultSender ?? from,
          };
          return this.sms.create(msg);
        }),
      );
      return true;
    } catch (_) {}
  }
}
