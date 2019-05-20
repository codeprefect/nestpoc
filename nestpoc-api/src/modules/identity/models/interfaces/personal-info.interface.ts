import { IPersonalInfo } from './personal-info.interface';
export interface IPersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  countryCode: string;
  phoneNumber: string;
  profileId?: string;
}

export interface IPersonalInfoUpdate {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  countryCode?: string;
  phoneNumber?: string;
}
