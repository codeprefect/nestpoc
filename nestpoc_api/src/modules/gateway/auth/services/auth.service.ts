import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  i18nEmailRegex,
  NestPocException,
  NestPocResponse,
} from '@nestpoc/common';
import { User, UserService } from '@nestpoc/identity';
import * as crypto from 'crypto';
import {
  I2FaHelpers,
  I2FaResults,
  twoFaHelpersKey,
} from '../helpers/two-fa.helper';
import { ILoginModel, ILoginResponse, ISignUpModel } from '../viewModels';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserService,
    private readonly jwtService: JwtService,
    @Inject(twoFaHelpersKey) private readonly twoFaHelpers: I2FaHelpers,
  ) {}

  public async login(model: ILoginModel): Promise<ILoginResponse> {
    let response: ILoginResponse;
    const isEmail = i18nEmailRegex.test(model.username);
    const user = await this.findUser(model, isEmail);

    const validPassword = await this.verifyPassword(model, user, isEmail);
    const validToken = await this.verifyToken(model, user);

    if (validPassword && !validToken) {
      response = await this.createTemp2FaToken(user);
    } else {
      response = await this.getJwtToken(user);
    }
    return response;
  }

  public async signUp(model: ISignUpModel): Promise<ILoginResponse> {
    const user = User.new({ ...model }, model.password);
    const newUser = await this.users.create(user);
    if (newUser) {
      return this.login(newUser);
    }
  }

  public async enable2FA(username: string): Promise<I2FaResults> {
    const user = await this.users.findByUsername(username);
    if (!user) {
      throw new NestPocException('user with specified username does not exist');
    }

    if (this.users.is2FAEnabled(user)) {
      throw new NestPocException('user already has 2FA enabled');
    }

    const twoFaDetails = this.twoFaHelpers.get2FASecretWithQRCode(
      user.username,
    );
    await this.users.update(user.id, { temp2FASecret: twoFaDetails.secret });
    return twoFaDetails;
  }

  public async complete2FaActivation(
    username: string,
    code: string,
  ): Promise<NestPocResponse> {
    const user = await this.users.findByUsername(username);
    if (!user) {
      throw new NestPocException('user with specified username does not exist');
    }
    const verified = this.twoFaHelpers.verifyCode(user.temp2FASecret, code);
    if (!verified) {
      throw new NestPocException('2FA Confirmation failed');
    }
    await this.users.update(user.id, {
      twoFASecret: user.temp2FASecret,
      temp2FASecret: null,
    });

    return new NestPocResponse({
      success: verified,
      message: '2FA authenticated successfully',
    });
  }

  private async findUser(model: ILoginModel, isEmail = true): Promise<User> {
    const user = isEmail
      ? await this.users.findByEmail(model.username)
      : await this.users.findByUsername(model.username);
    return user;
  }

  private async createTemp2FaToken(user: User): Promise<ILoginResponse> {
    const temp2FaToken = crypto.randomBytes(16).toString('hex');
    await this.users.update(user.id, { temp2FASecret: temp2FaToken });
    return {
      success: false,
      token: temp2FaToken,
      has2fa: true,
    };
  }

  private validateTempToken(user: User, token: string): boolean {
    const valid = token != null && token === user.temp2FASecret;
    if (!valid) {
      throw new NestPocException('invalid token and code provided');
    }
    return valid;
  }

  private validateIndirectToken(user: User, model: ILoginModel): boolean {
    if (model.code == null || model.token == null) {
      return false;
    }
    return (
      this.validateTempToken(user, model.token) &&
      this.validateToken(user, model.code)
    );
  }

  private validateDirectToken(user: User, model: ILoginModel): boolean {
    const validPassword = true;
    // const validPassword = await this.users.validatePassword(user, model.password);
    if (validPassword && this.validateToken(user, model.code)) {
      return true;
    }
    throw new NestPocException('token has expired, please retry');
  }

  private validateToken(user: User, code: string): boolean {
    if (!this.twoFaHelpers.verifyCode(user.twoFASecret, code)) {
      throw new NestPocException('token has expired, please retry');
    }
    return true;
  }

  private getJwtToken(user: User): ILoginResponse {
    const jwtPayload = this.jwtService.sign({
      email: user.email,
      id: user.id,
      username: user.username,
    });
    if (jwtPayload) {
      return {
        token: jwtPayload,
        success: true,
      };
    }
    throw new NestPocException('token cannot be generated at this time');
  }

  private async verifyPassword(
    model: ILoginModel,
    user: User,
    isEmail = false,
  ): Promise<boolean> {
    if (model.password) {
      const valid = await this.users.validatePassword(user, model.password);
      if (valid) {
        return true;
      }
    }
    const key = isEmail ? 'email' : 'username';
    throw new NestPocException(`${key} and password does not match`);
  }

  private verifyToken(model: ILoginModel, user: User): boolean {
    if (!this.users.is2FAEnabled(user)) {
      return true;
    }
    const isDirect = model.code != null && model.password != null;
    return isDirect
      ? this.validateDirectToken(user, model)
      : this.validateIndirectToken(user, model);
  }
}
