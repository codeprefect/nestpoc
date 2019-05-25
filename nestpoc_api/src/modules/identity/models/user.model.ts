import { NestPocBaseEntity } from '@nestpoc/common';
import { services } from '@nestpoc/common/config/constants';
import * as bcrypt from 'bcryptjs';
import { IsEmail, Length } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

import { IUser } from './interfaces/user.interface';

@Entity({
  schema: services.AUTH.schema,
})
export class User extends NestPocBaseEntity implements IUser {
  public static new ({ username, email }: IUser, password: string): User {
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;
    return user;
  }

  @Column({
    unique: true,
    type: 'varchar',
    length: 30,
  })
  public username: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: 100,
  })
  @Length(6, 100)
  @IsEmail()
  public email: string;

  @Column({
    type: 'varchar',
  })
  public hashedPassword: string;

  @Column({
    nullable: true,
  })
  public twoFASecret?: string;

  @Column({
    nullable: true,
  })
  public temp2FASecret?: string;

  @Length(8)
  public password: string;

  @BeforeInsert()
  public async hashPassword(): Promise<void> {
    if (this.password != null) {
      this.hashedPassword = await bcrypt.hash(this.password, 10);
    }
  }
}
