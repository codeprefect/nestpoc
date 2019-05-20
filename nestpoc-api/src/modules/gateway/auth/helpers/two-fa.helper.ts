import * as qr from 'qr-image';
import * as speakeasy from 'speakeasy';

export interface I2FaHelpers {
  get2FASecretWithQRCode(username: string): I2FaResults;
  verifyCode(secret: string, code: string): boolean;
}

export interface I2FaResults {
  secret: string;
  qr: string;
}

export const twoFaHelpersKey = '2FA_HELPERS';

export const twoFaHelpers: I2FaHelpers = {
  get2FASecretWithQRCode: (username: string): I2FaResults => {
    const { base32: secret } = speakeasy.generateSecret({ length: 20 });
    const authUrl = speakeasy.otpauthURL({
      secret, label: username, algorithm: 'sha512',
    });
    const qrCode = qr.imageSync(authUrl, { type: 'svg' });

    return {
      secret,
      qr: qrCode,
    };
  },

  verifyCode: (secret: string, token: string): boolean => {
    return speakeasy.totp.verify({ secret, token, window: 2 });
  },
};

export const twoFaHelpersProvider = {
  provide: twoFaHelpersKey,
  useValue: twoFaHelpers,
};
