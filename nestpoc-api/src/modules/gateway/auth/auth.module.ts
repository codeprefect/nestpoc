import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestpoc/common';
import { IdentityModule } from '@nestpoc/identity';
import { AuthController } from './controllers/auth.controller';
import { twoFaHelpersProvider } from './helpers/two-fa.helper';
import { AuthResolvers } from './resolvers/auth.resolvers';
import { AuthService } from './services/auth.service';
import { IsUniqueUser } from './viewModels/validators/Is-unique-user';

@Module({
  controllers: [AuthController],
  providers: [
    IsUniqueUser, AuthService,
    AuthResolvers,
    twoFaHelpersProvider,
  ],
  imports: [
    IdentityModule,
    // PassportModule.register({ defaultStrategy: '2fa-totp' }),
    JwtModule.registerAsync({
      useExisting: ConfigService,
    }),
  ],
})
export class AuthModule {}
