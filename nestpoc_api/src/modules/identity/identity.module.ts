import { Module } from '@nestjs/common';
import { CommonModule } from '@nestpoc/common';
import { PersonalInfoService } from './services/personal-info/personal-info.service';
import { UserService } from './services/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.model';
import { PersonalInfo } from './models/personal-info.model';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([User, PersonalInfo])],
  providers: [UserService, PersonalInfoService],
  exports: [UserService, PersonalInfoService],
})
export class IdentityModule {}
