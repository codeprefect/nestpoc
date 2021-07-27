import { v4 as uuidv4 } from 'uuid';
import { User } from '../models';
import { UserService } from '../services/user/user.service';

export const userStore: User[] = [];

export const userServiceMock = {
  findByEmail: (email: string): Promise<User> => {
    return new Promise((resolve) => {
      const user = userStore.find((u) => u.email === email.toLocaleUpperCase());
      resolve(user);
    });
  },
  findByUsername: (username: string): Promise<User> => {
    return new Promise((resolve) => {
      const user = userStore.find(
        (u) => u.username === username.toLocaleUpperCase(),
      );
      resolve(user);
    });
  },
  create: (model: User): Promise<User> => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = model;
        await user.hashPassword();
        user.email = user.email.toLocaleUpperCase();
        user.username = user.username.toLocaleUpperCase();
        user.id = uuidv4();
        user.created = new Date(Date.now());
        userStore.push(user);
        resolve(user);
      } catch (err) {
        reject(err);
      }
    });
  },
  validatePassword: UserService.prototype.validatePassword,
  is2FAEnabled: UserService.prototype.is2FAEnabled,
  update: (id: string, updateObject: any) => {
    return new Promise((resolve, reject) => {
      try {
        const [existing, index] = [
          userStore.find((u) => u.id === id),
          userStore.findIndex((u) => u.id === id),
        ];

        if (!existing) {
          throw new Error('specified model does not exist');
        }

        // const existingKeys = Object.keys(existing);
        Object.keys(updateObject).map((key) => {
          existing[key] = updateObject[key];
        });
        existing.updated = new Date(Date.now());
        userStore.splice(index, 1, existing);
        resolve(existing);
      } catch (err) {
        reject(err);
      }
    });
  },
};

export const userServiceProviderMock = {
  provide: UserService,
  useValue: userServiceMock,
};
