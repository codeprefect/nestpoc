import { Inject, Injectable } from '@nestjs/common';
import { identityRepositories } from '@nestpoc/identity/identity.repositories';
import { Repository } from 'typeorm';

import { IPersonalInfoUpdate, PersonalInfo } from '@nestpoc/identity';

@Injectable()
export class PersonalInfoService {
  constructor(@Inject(identityRepositories.PersonalInfo.key)
  private readonly personalInfo: Repository<PersonalInfo>) { }

  public async getByProfileId(profileId: string): Promise<PersonalInfo> {
    const profile = await this.personalInfo.findOne({ profileId }, {
      relations: ['profile'],
    });
    return profile;
  }

  public async create(model: PersonalInfo): Promise<PersonalInfo> {
    const created = await this.personalInfo.save(model);
    return created;
  }

  public async update(id: string, update: IPersonalInfoUpdate): Promise<PersonalInfo> {
    await this.personalInfo.update(id, update);
    const updated = await this.personalInfo.findOne(id);
    return updated;
  }
}
