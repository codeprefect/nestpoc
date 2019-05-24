import { Length, ValidateIf } from 'class-validator';

import { ILoginModel } from './interfaces/login.interface';

export class LoginModel implements ILoginModel {
  @Length(3)
  public username: string;

  @Length(8, 32)
  @ValidateIf(o => (o.code == null && o.token == null))
  public password?: string;

  public code?: string;
  @ValidateIf(o => (o.password == null))
  public token?: string;
}
