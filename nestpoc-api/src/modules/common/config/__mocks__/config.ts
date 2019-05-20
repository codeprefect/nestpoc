import { envProviderKey } from '../constants';

export const envFileMock = {
  provide: envProviderKey,
  useValue: 'test.env',
};
