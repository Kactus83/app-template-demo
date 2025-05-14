import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { VersionService } from '@custom/version/services/version.service';

/**
 * Intercepteur HTTP qui :
 *  - Force l’envoi des cookies (withCredentials: true) pour l’authentification,
 *  - Injecte la version du frontend dans l’en-tête `x-frontend-version`.
 *
 */
@Injectable()
export class VersionInterceptor implements HttpInterceptor {
  constructor(private readonly versionService: VersionService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const frontendVersion = this.versionService.getFrontendVersion();

    const cloned = req.clone({
      withCredentials: true,
      setHeaders: { 'x-frontend-version': frontendVersion },
    });

    return next.handle(cloned);
  }
}
