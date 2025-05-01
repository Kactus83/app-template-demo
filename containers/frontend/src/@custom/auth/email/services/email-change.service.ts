import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment';

// DTOs côté frontend
export interface ChangeEmailDto {
  newEmail: string;
}

export interface ConfirmEmailChangeDto {
  token: string;
}

/**
 * @module EmailChangeService
 * @description
 * Service de gestion du changement d'email primaire.
 *
 * Permet aux utilisateurs authentifiés de demander un changement d'email,
 * et de confirmer ce changement via un token de confirmation.
 */
@Injectable({ providedIn: 'root' })
export class EmailChangeService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.apiUrl;

  /**
   * Demande le changement de l'email primaire.
   * @param newEmail Le nouvel email à définir.
   * @returns Un Observable émettant un objet message.
   */
  requestEmailChange(newEmail: string): Observable<{ message: string }> {
    const dto: ChangeEmailDto = { newEmail };
    return this.http.post<{ message: string }>(`${this.baseUrl}/auth/change-email`, dto);
  }

  /**
   * Confirme le changement de l'email primaire avec un token.
   * @param token Le token de confirmation.
   * @returns Un Observable émettant un objet message.
   */
  confirmEmailChange(token: string): Observable<{ message: string }> {
    const dto: ConfirmEmailChangeDto = { token };
    return this.http.post<{ message: string }>(`${this.baseUrl}/auth/confirm-email-change`, dto);
  }
}
