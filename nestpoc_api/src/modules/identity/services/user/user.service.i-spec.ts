import { Test } from '@nestjs/testing';
import { IdentityModule, User, UserService } from '@nestpoc/identity';
import * as bcrypt from 'bcryptjs';
import { Connection, Repository } from 'typeorm';

import { identityRepositories } from '../../identity.repositories';

describe('UserService', () => {
  let userRepo: Repository<User>;

  let service: UserService;
  const testUser = User.new(
    { username: 'testuser', email: 'testuser@email.com' },
    'password123');
  let createdUser: User;

  beforeAll(async () => {
    // create test module
    const module = await Test.createTestingModule({
      imports: [IdentityModule],
    }).compile();

    // get db and repositories
    userRepo = module.get(identityRepositories.User.key, { strict: false });
    createdUser = await userRepo.save(testUser);

    // get service under test
    service = module.get<UserService>(UserService);
  });

  afterAll(async () => {
    await userRepo.delete(createdUser.id);
  });

  it('should create an instance of UserService', async () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let newUser: User;
    const anotherUser = User.new(
      { username: 'testusercreate', email: 'testusercreate@email.com' },
      'password123');
    beforeAll(async () => {
      newUser = await service.create(anotherUser);
    });

    afterAll(async () => {
      await userRepo.delete(newUser.id);
    });

    it('should return user with assigned id', async () => {
      expect(newUser).toBeDefined();
      expect(newUser.id).toBeDefined();
      expect(bcrypt.compareSync(anotherUser.password, newUser.hashedPassword)).toBeTruthy();
      expect(newUser.email).toEqual(anotherUser.email);
    });
  });

  describe('findUserByEmail', () => {
    it('should find specified user if exists', async () => {
      const testUser2 = await service.findByEmail(testUser.email);
      expect(testUser2).toBeDefined();
      expect(testUser2.hashedPassword).toBeDefined();
      expect(testUser2.email).toEqual(testUser.email);
    });
  });

  describe('findUserByUsername', () => {
    it('should return existing user with specified email', async () => {
      const testUser3 = await service.findByUsername(testUser.username);
      expect(testUser3).toBeDefined();
      expect(testUser3.hashedPassword).toBeDefined();
      expect(testUser3.email).toEqual(testUser.email);
    });
  });

  describe('is2FaEnabled', () => {
    it('should validate if 2FA is enabled', async () => {
      const enabledBefore = service.is2FAEnabled(createdUser);
      const updatedUser = await service.update(createdUser.id, { twoFASecret: 'Hello' });
      const enabledAfter = service.is2FAEnabled(updatedUser);

      expect(enabledBefore).toBeFalsy();
      expect(enabledAfter).toBeTruthy();
    });
  });

  describe('update', () => {
    it('should update user with new changes', async () => {
      const oldHash = createdUser.hashedPassword;
      const newPassword = 'ajanlekoko';
      const newHash = bcrypt.hashSync(newPassword);
      const updatedUser = await service.update(createdUser.id, { hashedPassword: newHash });

      expect(updatedUser.hashedPassword).toEqual(newHash);
      await service.update(createdUser.id, { hashedPassword: oldHash });
    });
  });

  describe('validatePassword', () => {
    it('should confirm if password matches', async () => {
      const wrongPassword = 'hello';
      const existingUser = await service.findByEmail(testUser.email);
      const validated = await service.validatePassword(existingUser, testUser.password);
      const wrong = await service.validatePassword(existingUser, wrongPassword);

      expect(validated).toBeTruthy();
      expect(wrong).toBeFalsy();
    });

    it('should return false if user is null', async () => {
      const dummyPassword = 'hello';
      const validated = await service.validatePassword(undefined, dummyPassword);
      expect(validated).toBeFalsy();
    });
  });
});
