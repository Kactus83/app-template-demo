import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WizardBlob } from './app-wizard.types';
import { environment } from '../../../../environment';

/**
 * Service pour interagir avec le domaine Demo → App Wizard.
 * Fournit le téléchargement du setup wizard.
 */
@Injectable({ providedIn: 'root' })
export class AppWizardService {
  private readonly http = inject(HttpClient);
  private readonly downloadUrl = `${environment.apiUrl}/wizard`;

  /**
   * Télécharge le ZIP du setup wizard.
   */
  downloadWizard(): Observable<WizardBlob> {
    return this.http.get(this.downloadUrl, { responseType: 'blob' });
  }
}
