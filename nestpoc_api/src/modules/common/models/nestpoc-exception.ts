import { HttpException, HttpStatus } from '@nestjs/common';

export class NestPocException extends HttpException {
  constructor(
    message: string | any,
    public readonly statusCode: number = HttpStatus.BAD_REQUEST,
  ) {
    super(message, statusCode);
    Error.captureStackTrace(this, NestPocException);
  }
}
