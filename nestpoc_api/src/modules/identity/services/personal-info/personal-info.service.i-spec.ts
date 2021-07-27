import { Test } from '@nestjs/testing';
import {
  IdentityModule,
  PersonalInfo,
  PersonalInfoService,
  User,
} from '@nestpoc/identity';
import { Repository } from 'typeorm';

import * as uuidv4 from 'uuid/v4';
import { identityRepositories } from '../../identity.repositories';

describe('PersonalInfoService', () => {
  let personalInfoRepo: Repository<PersonalInfo>;
  let userRepo: Repository<User>;

  let service: PersonalInfoService;
  let testProfileInfo: PersonalInfo;
  const testProfile = {
    user: User.new(
      { email: 'personalInfo@example.com', username: 'personalinfo' },
      'p@ssw0rd!',
    ),
    personalInfo: PersonalInfo.new({
      firstName: 'Personal',
      lastName: 'Info',
      phoneNumber: '08108766845',
      dateOfBirth: new Date(Date.now()),
      countryCode: '234',
    }),
  };

  beforeAll(async () => {
    // create test module
    const module = await Test.createTestingModule({
      imports: [IdentityModule],
    }).compile();

    // extract needed repositories and database connection
    [userRepo, personalInfoRepo] = [
      module.get(identityRepositories.User.key, { strict: false }),
      module.get(identityRepositories.PersonalInfo.key, { strict: false }),
    ];

    // add and extract test data
    const testUser = await userRepo.save(testProfile.user);
    testProfile.personalInfo.profileId = testUser.id;
    await personalInfoRepo.save(testProfile.personalInfo);
    testProfileInfo = await personalInfoRepo.findOne(
      { profileId: testUser.id },
      { relations: ['profile'] },
    );

    // get service we need to test
    service = module.get<PersonalInfoService>(PersonalInfoService);
  });

  afterAll(async () => {
    await personalInfoRepo.delete(testProfileInfo.profileId);
    await userRepo.delete(testProfileInfo.profileId);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(testProfileInfo).toBeDefined();
    expect(testProfileInfo.profile).toBeDefined();
  });

  describe('getByProfileId', () => {
    it('should return valid user if profileId exists', async () => {
      const result = await service.getByProfileId(testProfileInfo.profileId);

      expect(result).toBeDefined();
      expect(result.profileId).toEqual(testProfileInfo.profileId);
    });

    it('should return null if profileId is invalid', async () => {
      const fakeId = uuidv4();
      const result = await service.getByProfileId(fakeId);
      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    let profile: User;
    const testInfo = testProfile.personalInfo;

    beforeAll(async () => {
      const user = User.new(
        { username: 'testuser4', email: 'testuser4@test.com' },
        'P@ssw0rd!',
      );
      profile = await userRepo.save(user);
    });

    afterAll(async () => {
      await personalInfoRepo.delete(profile.id);
      await userRepo.delete(profile.id);
    });

    it('should create personal info when entry is valid', async () => {
      const testCreate = PersonalInfo.new(testInfo);
      testCreate.profileId = profile.id;
      const result = await service.create(testInfo);
      expect(result).toBeDefined();
      expect(result.profileId).toBeDefined();
    });

    it('should fail when profileId is not provided', async () => {
      const testFail = PersonalInfo.new(testInfo);
      delete testFail.profileId;
      expect(service.create(testFail)).rejects.toThrowError();
    });

    it('should fail when profileId is not a valid foreign key', async () => {
      const testFail = PersonalInfo.new(testInfo);
      testFail.profileId = uuidv4();
      expect(service.create(testFail)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update existing info', async () => {
      const testFirstName = 'Sanwo-olu';
      const updated = await service.update(testProfileInfo.profileId, {
        firstName: testFirstName,
      });
      expect(updated.firstName).toEqual(testFirstName);
      expect(updated.profileId).toEqual(testProfileInfo.profileId);
      expect(updated.version).not.toEqual(1);
    });
  });
});
