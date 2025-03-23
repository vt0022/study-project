export class ResponseDto<T> {
  timestamp: string = new Date().toISOString();
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
}
