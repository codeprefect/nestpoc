import { NestPocTrackedEntity } from '@nestpoc/common';
import { services } from '@nestpoc/common/config/constants';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { IPersonalInfo } from './interfaces/personal-info.interface';
import { User } from './user.model';

@Entity({
  schema: services.AUTH.schema,
})
export class PersonalInfo
  extends NestPocTrackedEntity
  implements IPersonalInfo
{
  public static new({
    firstName,
    lastName,
    phoneNumber,
    dateOfBirth,
    countryCode,
    profileId,
  }: IPersonalInfo): PersonalInfo {
    const profile = new PersonalInfo();
    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.phoneNumber = phoneNumber;
    profile.dateOfBirth = dateOfBirth;
    profile.countryCode = countryCode;
    profile.profileId = profileId;
    return profile;
  }

  @Column({
    type: 'varchar',
    length: 30,
  })
  public firstName: string;

  @Column({
    type: 'varchar',
    length: 30,
  })
  public lastName: string;

  @Column()
  public dateOfBirth: Date;

  @Column({
    type: 'varchar',
    length: 4,
  })
  public countryCode: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  public phoneNumber: string;

  @OneToOne(() => User)
  @JoinColumn()
  public profile: User;

  @PrimaryColumn()
  public profileId: string;

  @BeforeInsert()
  @BeforeUpdate()
  public cleanPhoneNumber() {
    if (this.phoneNumber != null) {
      this.phoneNumber = this.phoneNumber.replace(/^0+/, '');
    }
  }
}
