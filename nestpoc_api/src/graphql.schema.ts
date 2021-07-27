
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class LoginInput {
    username: string;
    password?: Nullable<string>;
    code?: Nullable<string>;
    token?: Nullable<string>;
}

export class SignUpInput {
    email: string;
    username: string;
    password: string;
}

export abstract class IMutation {
    abstract logIn(loginInput?: Nullable<LoginInput>): LoginResponse | Promise<LoginResponse>;

    abstract signUp(signUpInput?: Nullable<SignUpInput>): LoginResponse | Promise<LoginResponse>;

    abstract enable2Fa(username?: Nullable<string>): TwoFaResponse | Promise<TwoFaResponse>;

    abstract confirm2Fa(token?: Nullable<string>): NestPocResponse | Promise<NestPocResponse>;
}

export abstract class IQuery {
    abstract getUser(email?: Nullable<string>): UserResult | Promise<UserResult>;
}

export class UserResult {
    id: string;
    email?: Nullable<string>;
    username?: Nullable<string>;
}

export class LoginResponse {
    success: boolean;
    token?: Nullable<string>;
    has2fa?: Nullable<boolean>;
}

export class TwoFaResponse {
    secret: string;
    qr: string;
}

export class NestPocResponse {
    statusCode: number;
    message: string;
}

type Nullable<T> = T | null;
