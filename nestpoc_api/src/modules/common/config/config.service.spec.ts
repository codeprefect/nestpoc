import { Test, TestingModuleBuilder } from '@nestjs/testing';

import { envFileMock } from './__mocks__/config';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let module: TestingModuleBuilder;
  let configService: ConfigService;

  const jwtPrivateKeyMock = 'justanylongrandomstring';
  const databaseStoreMock = 'nestpoc_test';

  beforeEach(async () => {
    module = Test.createTestingModule({
      providers: [
        ConfigService,
        envFileMock,
      ],
    });
    const compiledModule = await module.compile();
    configService = compiledModule.get<ConfigService>(ConfigService);
  });

  it('should create an instance of ConfigService', () => {
    expect(configService).toBeDefined();
  });

  it('should fail to instantiate when a required config parameter is missing', async (done) => {
    const storeName = process.env.NESTPOC_DB_STORE;
    process.env.NESTPOC_DB_STORE = '';
    try {
      await module.compile();
    } catch (err) {
      expect(err.message).toContain('NESTPOC_DB_STORE');
    }
    process.env.NESTPOC_DB_STORE = storeName;
    done();
  });

  describe('createJwtOptions', () => {
    it('should create jwtOptions', () => {
      const jwtOptions = configService.createJwtOptions();
      expect(jwtOptions).toBeDefined();
      expect(jwtOptions.secretOrKeyProvider).toBeInstanceOf(Function);
      expect(jwtOptions.secretOrKeyProvider(0, {})).toEqual(jwtPrivateKeyMock);
    });
  });

  describe('createDatabaseOptions', () => {
    it('should return database options', () => {
      const databaseOptions = configService.createDatabaseOpts();
      expect(databaseOptions).toBeDefined();
      expect(databaseOptions.database).toEqual(databaseStoreMock);
    });
  });

  describe('createGqlOptions', () => {
    it('should return an object of type GqlModuleOptions', () => {
      const options = configService.createGqlOptions();
      expect(options).toBeDefined();
      expect(options.tracing).toBeTruthy();
    });
  });

  describe('createAfricasTalkingOptions', () => {
    it('should return an object of type IAfricasTalkingOptions', () => {
      const options = configService.createAfricasTalkingOptions();
      expect(options).toBeDefined();
      expect(options.options.apiKey).toBeDefined();
      expect(options.options.username).toEqual('sandbox');
      expect(options.defaultSender).toEqual('nestpoc test');
    });
  });

  describe('createTwilioOptions', () => {
    it('should return default sender id', () => {
      const options = configService.createTwilioOptions();
      expect(options).toBeDefined();
    });
  });

  describe('get port', () => {
    it('should return specified port number', () => {
      const port = configService.port;
      expect(port).toEqual(7000);
    });
  });
});
