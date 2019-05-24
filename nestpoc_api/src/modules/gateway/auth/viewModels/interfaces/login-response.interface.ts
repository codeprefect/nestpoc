export interface ILoginResponse {
  success: boolean;
  token?: string;
  has2fa?: boolean;
}

export interface I2FaResponse {
  secret: string;
  qr: string;
}
