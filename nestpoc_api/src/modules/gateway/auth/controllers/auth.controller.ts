import { Body, Controller, Post, Query } from '@nestjs/common';
import { NestPocResponse } from '@nestpoc/common';
import { AuthService } from '../services/auth.service';
import { I2FaResponse, ILoginResponse, LoginModel, SignUpModel } from '../viewModels';

@Controller('/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  public async signUp(@Body() model: SignUpModel): Promise<ILoginResponse> {
    return this.authService.signUp(model);
  }

  @Post('logIn')
  public async login(@Body() model: LoginModel): Promise<ILoginResponse> {
    return this.authService.login(model);
  }

  @Post('enable2Fa')
  public async enable2FA(@Query('username') username: string): Promise<I2FaResponse> {
    return this.authService.enable2FA(username);
  }

  @Post('confirm2Fa')
  public async confirm2FA(@Query('token') token: string): Promise<NestPocResponse> {
    const username = 'codeprefect';
    return this.authService.complete2FaActivation(username, token);
  }
}
