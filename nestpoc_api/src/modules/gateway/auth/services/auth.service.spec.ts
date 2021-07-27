import { Test } from '@nestjs/testing';
import { userServiceProviderMock } from '@nestpoc/identity/__mocks__/identity';
import { jwtServiceProviderMock } from '../__mocks__/auth';
import { twoFaHelpersProvider } from '../helpers/two-fa.helper';
import { SignUpModel } from '../viewModels/signup.model';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  const testUser = new SignUpModel();
  testUser.email = 'testuser@email.com';
  testUser.password = 'p@ssw0rd1';
  testUser.username = 'testuser';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        twoFaHelpersProvider,
        userServiceProviderMock,
        jwtServiceProviderMock,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should create an instance of user service', async () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a user account if all necessary properties are submitted', async () => {
      const signUpResult = await authService.signUp(testUser);
      expect(signUpResult).toBeDefined();
      expect(signUpResult.success).toBeTruthy();
      expect(signUpResult.token).toBeDefined();
      expect(signUpResult.has2fa).toBeFalsy();
    });
  });

  describe('enable2Fa', () => {
    const twoFaSignUp = new SignUpModel();
    twoFaSignUp.email = 'twofauser@email.com';
    twoFaSignUp.password = 'twofaPassword';
    twoFaSignUp.username = 'twofauser';
    let userUpdateMock;

    beforeAll(async () => {
      await authService.signUp(twoFaSignUp);
    });

    beforeEach(() => {
      userUpdateMock = jest.spyOn(userServiceProviderMock.useValue, 'update');
    });

    it('should start the process of 2FA security for user', async () => {
      const twoFaResult = await authService.enable2FA(twoFaSignUp.username);

      expect(twoFaResult.secret).toBeDefined();
      expect(userUpdateMock).toBeCalledWith(expect.any(String), {
        temp2FASecret: twoFaResult.secret,
      });
    });
  });

  describe('login', () => {
    const loginSignUp = new SignUpModel();
    loginSignUp.email = 'loginuser@email.com';
    loginSignUp.password = 'loginPassword';
    loginSignUp.username = 'loginuser';

    beforeAll(async () => {
      await authService.signUp(loginSignUp);
    });

    it('should generate token if user does not have 2fa enabled', async () => {
      const loginResult = await authService.login({
        username: loginSignUp.email,
        password: loginSignUp.password,
      });

      expect(loginResult.success).toBeTruthy();
      expect(loginResult.token).toBeDefined();
      expect(loginResult.has2fa).toBeFalsy();
    });
  });

  // describe('complete2FaActivation', () => {

  // });
});
