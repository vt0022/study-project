import { HttpStatus } from '@nestjs/common';
import { ResponseStatus } from '../enums/responseStatus.enum';

export class ResponseDto<T> {
  timestamp: string = new Date().toLocaleString('vi-VN', { timeZone: 'UTC' });
  status: string;
  statusCode: number;
  message: string;
  data?: T;

  constructor(status: string, statusCode: number, message: string, data?: T) {
    this.status = status;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static success<T>(message: string, data?: T): ResponseDto<T> {
    return new ResponseDto<T>(
      ResponseStatus.Success,
      HttpStatus.OK,
      message,
      data,
    );
  }

  static failure<T>(
    statusCode: number = HttpStatus.BAD_REQUEST,
    message: string,
    data?: T,
  ): ResponseDto<T> {
    return new ResponseDto<T>(ResponseStatus.Error, statusCode, message, data);
  }
}
