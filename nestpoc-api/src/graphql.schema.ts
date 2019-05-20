
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class LoginInput {
    username: string;
    password?: string;
    code?: string;
    token?: string;
}

export class SignUpInput {
    email: string;
    username: string;
    password: string;
}

export class LoginResponse {
    success: boolean;
    token?: string;
    has2fa?: boolean;
}

export abstract class IMutation {
    abstract logIn(loginInput?: LoginInput): LoginResponse | Promise<LoginResponse>;

    abstract signUp(signUpInput?: SignUpInput): LoginResponse | Promise<LoginResponse>;

    abstract enable2Fa(username?: string): TwoFaResponse | Promise<TwoFaResponse>;

    abstract confirm2Fa(token?: string): NestPocResponse | Promise<NestPocResponse>;
}

export class NestPocResponse {
    statusCode: number;
    message: string;
}

export abstract class IQuery {
    abstract temp__(): boolean | Promise<boolean>;
}

export class TwoFaResponse {
    secret: string;
    qr: string;
}
