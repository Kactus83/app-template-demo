import { HttpInterceptorFn, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MetadataService } from '../services/metadata.service';
import { Observable } from 'rxjs';

/**
 * Intercepteur HTTP fonctionnel qui injecte les métadonnées du client
 * dans l’en-tête `x-client-metadata` (JSON), et conserve withCredentials.
 *
 * @category Metadata
 * @subcategory Interceptors
 */
export const metadataInterceptor: HttpInterceptorFn = (req, next) => {
  const metadataService = inject(MetadataService);
  const metadata = metadataService.getMetadata();
  const cloned = req.clone({
    withCredentials: true,
    setHeaders: {
      'x-client-metadata': JSON.stringify(metadata),
    },
  });
  return next(cloned) as Observable<HttpEvent<unknown>>;
};
