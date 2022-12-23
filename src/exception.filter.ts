import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const responseBody: any = exception.getResponse();

    switch (status) {
      case 401: {
        response.sendStatus(status);
        break;
      }
      case 403: {
        response.sendStatus(status);
        break;
      }
      case 404: {
        response.sendStatus(status);
        break;
      }
      case 429: {
        response.sendStatus(status);
        break;
      }
      default: {
        const errorResponse = [];
        responseBody.message.forEach((m) => errorResponse.push(m));
        response.status(status).json({
          errorsMessages: errorResponse,
        });
      }
    }
  }
}
