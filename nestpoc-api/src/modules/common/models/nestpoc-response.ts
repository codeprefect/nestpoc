export class NestPocResponse {
  public message: any;
  constructor(
    message: string | any,
    public readonly statusCode: number = 200,
  ) {
    if (message instanceof Object) {
      Object.assign(this, message);
    } else {
      this.message = message;
    }
  }
}
