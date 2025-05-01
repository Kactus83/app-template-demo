import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import { LoggerService } from '../modules/logger/logger.service';

/**
 * Filtre global permettant d'intercepter toutes les exceptions,
 * de les logger, de les envoyer à Sentry et de formater la réponse HTTP.
 * @category Core
 * @category Filters
 * @implements ExceptionFilter
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Logger l'erreur avec les détails
    this.logger.error(
      `HTTP Status: ${status} Error Message: ${JSON.stringify(message)}`,
      exception instanceof Error ? exception.stack : ''
    );

    // Envoyer l'exception à Sentry pour le monitoring
    Sentry.captureException(exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
