import { IUser } from '@nestpoc/identity/models/interfaces/user.interface';

export interface ISignUpModel {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
