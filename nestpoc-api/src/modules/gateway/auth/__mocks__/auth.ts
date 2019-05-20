import { JwtService } from '@nestjs/jwt';

export const jwtServiceProviderMock = {
  provide: JwtService,
  useValue: new JwtService({
    secretOrPrivateKey: process.env.NESTPOC_JWT_PRIVATE_KEY,
    signOptions: {
      expiresIn: '1d',
    },
  }),
};
