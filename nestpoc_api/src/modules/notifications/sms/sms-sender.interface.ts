export interface ISmsSender {
  send(message: ISmsModel, from?: string): Promise<boolean>;
}

export interface ISmsModel {
  to: string[];
  message: string;
}

export type ISmsProvider = (key: string) => ISmsSender;
