import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { NestPocResponse } from '@nestpoc/common';
import { AuthService } from '../services/auth.service';
import { I2FaResponse, ILoginResponse, LoginModel, SignUpModel } from '../viewModels';

@Resolver('Auth')
export class AuthResolvers {
  constructor(private readonly authService: AuthService) {}

  @Mutation('logIn')
  public async logIn(
    @Args('loginInput') login: LoginModel,
  ): Promise<ILoginResponse> {
    return this.authService.login(login);
  }

  @Mutation('signUp')
  public async signUp(
    @Args('signUpInput') signUp: SignUpModel,
  ): Promise<ILoginResponse> {
    return this.authService.signUp(signUp);
  }

  @Mutation('enable2Fa')
  public async enable2FA(@Args('username') username: string): Promise<I2FaResponse> {
    return this.authService.enable2FA(username);
  }

  @Mutation('confirm2Fa')
  public async confirm2FA(@Args('token') token: string): Promise<NestPocResponse> {
    const username = 'codeprefect';
    return this.authService.complete2FaActivation(username, token);
  }
}
