import { Injectable, NestMiddleware, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { VersionService } from '../services/version.service';

@Injectable()
export class VersionCheckMiddleware implements NestMiddleware {
  private readonly logger = new Logger(VersionCheckMiddleware.name);
  constructor(private readonly versionService: VersionService) {
    this.logger.log('VersionCheckMiddleware loaded');
  }

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.originalUrl === '/health' || req.originalUrl === '/docs') { 
      return next();
    }

    const frontendVersion = req.cookies['frontend_version'] as string;

    if (!frontendVersion) {
      throw new HttpException('Frontend version not provided', HttpStatus.BAD_REQUEST);
    }

    const currentVersion = await this.versionService.getVersion();

    if (!currentVersion) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (frontendVersion !== currentVersion.frontend) {
      throw new HttpException(
        `Frontend version ${frontendVersion} is not supported. Please update your frontend to version ${currentVersion.frontend}.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    next();
  }
}
