import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { identityRepositories } from '../../identity.repositories';
import { IUserUpdate } from '../../models/interfaces/user.interface';
import { User } from '../../models/user.model';

@Injectable()
export class UserService {
  constructor(@Inject(identityRepositories.User.key)
  private readonly users: Repository<User>) { }

  public async findByEmail(email: string): Promise<User> {
    return this.users.findOne({ email });
  }

  public async findByUsername(username: string): Promise<User> {
    return this.users.findOne({ username });
  }

  public async validatePassword(user: User, password: string): Promise<boolean> {
    if (user != null) {
      return bcrypt.compare(password, user.hashedPassword);
    }
    return;
  }

  public async create(model: User): Promise<User> {
    const newUser = await this.users.save(model);
    return newUser;
  }

  public is2FAEnabled(user: User): boolean {
    return user.twoFASecret ? true : false;
  }

  public async update(id: string, updateObject: IUserUpdate): Promise<User> {
    await this.users.update(id, updateObject);
    const updatedUser = this.users.findOne(id);
    return updatedUser;
  }
}
