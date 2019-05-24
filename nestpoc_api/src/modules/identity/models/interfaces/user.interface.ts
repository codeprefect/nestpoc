export interface IUser {
  username: string;
  email: string;
}

export interface IUserUpdate {
  username?: string;
  email?: string;
  twoFASecret?: string;
  temp2FASecret?: string;
  hashedPassword?: string;
}
