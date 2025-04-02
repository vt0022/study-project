import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseDto } from '../dto/response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = '';

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'Unexpected error';

      return response
        .status(HttpStatus.OK)
        .json(ResponseDto.failure(status, message));
    }

    message =
      exception instanceof Error && exception.message
        ? exception.message
        : 'Internal server error';

    return response
      .status(HttpStatus.OK)
      .json(ResponseDto.failure(HttpStatus.INTERNAL_SERVER_ERROR, message));
  }
}
