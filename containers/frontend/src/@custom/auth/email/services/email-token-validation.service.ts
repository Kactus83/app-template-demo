import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environment';
import { Observable } from 'rxjs';
import { EmailValidationTokenDto } from '../models/dto/email.dto';
import { EmailTokenAction } from '../models/types/email.types';

/**
 * @service EmailTokenValidationService
 * @description Service centralisé pour valider un token d'email selon différentes actions.
 *
 * Ce service propose la méthode validateToken qui, en fonction du type d'action,
 * envoie le token au backend via un endpoint POST, en utilisant un DTO.
 */
@Injectable({
  providedIn: 'root',
})
export class EmailTokenValidationService {
  private _httpClient = inject(HttpClient);
  private _baseUrl = environment.apiUrl;

  /**
   * Valide un token d'email selon l'action spécifiée.
   *
   * @param action L'action de validation à effectuer (voir EmailTokenAction).
   * @param token Le token à valider.
   * @returns Observable<any> contenant la réponse du backend.
   */
  validateToken(action: EmailTokenAction, token: string): Observable<any> {
    // Tous les endpoints utilisent POST avec le body { token }
    switch (action) {
      case EmailTokenAction.VERIFY_EMAIL:
        return this._httpClient.post(`${this._baseUrl}/auth/email/verify-email`, { token } as EmailValidationTokenDto);
      case EmailTokenAction.CONFIRM_EMAIL_CHANGE:
        return this._httpClient.post(`${this._baseUrl}/auth/email/confirm-email-change`, { token } as EmailValidationTokenDto);
      case EmailTokenAction.CONFIRM_SECONDARY_EMAIL_CHANGE:
        return this._httpClient.post(`${this._baseUrl}/auth/email/confirm-secondary-email-change`, { token } as EmailValidationTokenDto);
      case EmailTokenAction.CONFIRM_SECONDARY_EMAIL_DELETION:
        return this._httpClient.post(`${this._baseUrl}/auth/email/confirm-secondary-email-deletion`, { token } as EmailValidationTokenDto);
      default:
        throw new Error(`Unsupported email token action: ${action}`);
    }
  }
}
