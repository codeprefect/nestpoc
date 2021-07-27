import { Injectable } from '@nestjs/common';
import { UserService } from '@nestpoc/identity';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsUniqueUser', async: true })
@Injectable()
export class IsUniqueUser implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}
  public async validate(
    value: any,
    args?: ValidationArguments,
  ): Promise<boolean> {
    let existingUser;
    if (args.constraints[0] === 'email') {
      existingUser = await this.userService.findByEmail(value);
    } else {
      existingUser = await this.userService.findByUsername(value);
    }
    return existingUser ? false : true;
  }
}
