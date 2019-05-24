import { Connection } from 'typeorm';
import { databaseProviderKey } from './constants';
export const getModelRepository = (model: ModelRepository): {
  provide: string,
  useFactory: any,
  inject: string[],
} => {
  return {
    provide: model.key,
    useFactory: (conn: Connection) => conn.getRepository(model.schema),
    inject: [databaseProviderKey],
  };
};

export const getModelRepositories = (models: IServiceRepositories): {
  provide: string,
  useFactory: any,
  inject: string[],
}[] => Object.keys(models).map(m => getModelRepository(models[m]));

export class ModelRepository {
  constructor(readonly key: string,
              readonly schema: any) {}
}

export interface IServiceRepositories {
  [key: string]: ModelRepository;
}

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
