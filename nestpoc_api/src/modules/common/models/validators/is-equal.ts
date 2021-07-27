import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsEqual' })
export class IsEqual implements ValidatorConstraintInterface {
  public validate(
    value: any,
    args?: ValidationArguments,
  ): boolean | Promise<boolean> {
    return value === args.object[args.constraints[0]];
  }
}
