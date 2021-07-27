export interface IAfricasTalkingOptions {
  options: {
    username: string;
    apiKey: string;
  };
  defaultSender: string;
}

export interface ITwilioOptions {
  accountSid: string;
  authToken: string;
  sender: string;
}
