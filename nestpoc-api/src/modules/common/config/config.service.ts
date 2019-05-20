import * as Joi from '@hapi/joi';
import { Inject, Injectable } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

import { envProviderKey } from './constants';
import { IAfricasTalkingOptions, ITwilioOptions } from './helpers';

export interface IEnvConfig {
  [key: string]: string;
}
@Injectable()
export class ConfigService implements JwtOptionsFactory, GqlOptionsFactory {
  private envConfig: IEnvConfig = {};

  constructor(
    @Inject(envProviderKey) filePath: string,
  ) {
    const cmdconfig = this.getSystemVariables();
    const parsedConfig = this.getParsedVariables(filePath);
    this.envConfig = this.validateInput({ ...cmdconfig, ...parsedConfig });
  }

  private getParsedVariables(filePath: string): IEnvConfig {
    let config: IEnvConfig;
    try {
      config = dotenv.parse(fs.readFileSync(filePath));
    } catch (err) {
      config = {};
    }
    return config;
  }

  private getSystemVariables(): IEnvConfig {
    const config = Object.keys(process.env)
      .filter(key => key.startsWith('NESTPOC_'))
      .reduce((obj, key) => {
        obj[key] = process.env[key];
        return obj;
      },
              {});
    config['NODE_ENV'] = process.env.NODE_ENV;
    return config;
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: IEnvConfig): IEnvConfig {
    const defaultSchema = {
      NODE_ENV: Joi.string()
        .valid(['development', 'production', 'test', 'staging'])
        .default('development'),
      NESTPOC_PORT: Joi.number().default(3000),
      NESTPOC_DB_TYPE: Joi.string()
        .valid(['postgres', 'mysql', 'mssql'])
        .default('postgres'),
      NESTPOC_DB_HOST: this.isDevelopment
        ? Joi.string().default('localhost') : Joi.string().required(),
      NESTPOC_DB_PORT: Joi.number().default(5432),
      NESTPOC_DB_USER: this.isDevelopment
        ? Joi.string().default('postgres') : Joi.string().required(),
      NESTPOC_DB_PASS: Joi.string().optional(),
      NESTPOC_DB_STORE: Joi.string().required(),
      NESTPOC_JWT_PRIVATE_KEY: Joi.string().required(),
      NESTPOC_AFRICASTALKING_KEY: Joi.string().required(),
      NESTPOC_AFRICASTALKING_USERNAME:
        this.isDevelopment ? Joi.string().default('sandbox') : Joi.string().required(),
      NESTPOC_AFRICASTALKING_SMS_SENDER: this.isDevelopment
        ? Joi.string().default('NESTPOC') : Joi.string().required(),
      NESTPOC_TWILIO_ACCOUNT_SID: Joi.optional(),
      NESTPOC_TWILIO_AUTH_TOKEN: Joi.optional(),
      NESTPOC_TWILIO_SENDER: Joi.optional(),
    };

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      defaultSchema,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  private get isDevelopment(): boolean {
    const env = this.envConfig.NODE_ENV || process.env.NODE_ENV;
    return ['DEVELOPMENT', 'DEV'].includes(env.toLocaleUpperCase());
  }

  public createDatabaseOpts(): any {
    const entitiesPath = path.join(process.cwd(), 'src/**/models/*.model.ts');
    const migrationsPath = path.join(process.cwd(), 'src/../migrations/*.ts');
    return {
      type: this.envConfig.NESTPOC_DB_TYPE,
      host: this.envConfig.NESTPOC_DB_HOST,
      port: Number(this.envConfig.NESTPOC_DB_PORT),
      username: this.envConfig.NESTPOC_DB_USER,
      password: this.envConfig.NESTPOC_DB_PASS,
      database: this.envConfig.NESTPOC_DB_STORE,
      entities: [entitiesPath],
      migrations: [migrationsPath],
      synchronize: true,
    };
  }

  public createJwtOptions(): JwtModuleOptions {
    return {
      secretOrPrivateKey: this.envConfig.NESTPOC_JWT_PRIVATE_KEY,
      signOptions: {
        expiresIn: '1d',
      },
    };
  }

  public createGqlOptions(): GqlModuleOptions {
    return {
      typePaths: [path.join(process.cwd(), 'src/**/*.graphql')],
      context: ({ req, res, connection, payload }) => {
        if (req) {
          return { headers: req.headers };
        }
      },
      // installSubscriptionHandlers: true,
      definitions: {
        path: path.join(process.cwd(), 'src/graphql.schema.ts'),
        outputAs: 'class',
      },
      playground: true,
      tracing: this.isDevelopment ? true : false,
    };
  }

  public createAfricasTalkingOptions(): IAfricasTalkingOptions {
    return {
      options: {
        username: this.envConfig.NESTPOC_AFRICASTALKING_USERNAME,
        apiKey: this.envConfig.NESTPOC_AFRICASTALKING_KEY,
      },
      defaultSender: this.envConfig.NESTPOC_AFRICASTALKING_SMS_SENDER,
    };
  }

  public createTwilioOptions(): ITwilioOptions {
    const options = {
      accountSid: this.envConfig.NESTPOC_TWILIO_ACCOUNT_SID,
      authToken: this.envConfig.NESTPOC_TWILIO_AUTH_TOKEN,
      sender: this.envConfig.NESTPOC_TWILIO_SENDER,
    };
    if (options.accountSid == null || options.authToken == null || options.sender == null) {
      console.warn(`Please note that NESTPOC_TWILIO_ACCOUNT_SID,\n
      NESTPOC_TWILIO_AUTH_TOKEN and NESTPOC_TWILIO_SENDER are required to use\n
      the twilio sms api, you may encounter problem sending sms`);
    }
    return options;
  }

  public get port(): number {
    return Number(this.envConfig.NESTPOC_PORT);
  }
}
