import { IServiceRepositories, ModelRepository } from '@nestpoc/common';

import { PersonalInfo } from './models/personal-info.model';
import { User } from './models/user.model';

export const identityRepositories: IServiceRepositories = {
  PersonalInfo: new ModelRepository('PERSONAL_INFOS', PersonalInfo),
  User: new ModelRepository('USERS', User),
};
