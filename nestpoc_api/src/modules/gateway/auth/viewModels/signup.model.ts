import { IsEqual } from '@nestpoc/common';
import { IsEmail, IsOptional, Length, Validate } from 'class-validator';

import { ISignUpModel } from './interfaces';
import { IsUniqueUser } from './validators';

export class SignUpModel implements ISignUpModel {
  @Length(3, 30)
  @Validate(
    IsUniqueUser, ['username'],
    { message: 'user with given username ($value) already exists' })
  public username: string;

  @Length(8, 32)
  public password: string;

  @IsOptional()
  @Validate(IsEqual, ['password'], { message: 'password does not match' })
  public confirmPassword: string;

  @IsEmail()
  @Validate(
    IsUniqueUser, ['email'],
    { message: 'user with given email ($value) already exists' })
  public email: string;
}
