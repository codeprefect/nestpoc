import { Module } from '@nestjs/common';
import { CommonModule, getModelRepositories } from '@nestpoc/common';

import { identityRepositories } from './identity.repositories';
import { PersonalInfoService } from './services/personal-info/personal-info.service';
import { UserService } from './services/user/user.service';

const authRepositoriesProviders = getModelRepositories(identityRepositories);

@Module({
  imports: [
    CommonModule,
  ],
  providers: [
    ...authRepositoriesProviders,
    UserService,
    PersonalInfoService,
  ],
  exports: [
    UserService,
    PersonalInfoService,
  ],
})
export class IdentityModule { }
