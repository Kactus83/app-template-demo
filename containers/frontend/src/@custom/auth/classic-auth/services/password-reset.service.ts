import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment';

// DTOs côté frontend (définis en tant qu'interfaces simples)
export interface PasswordResetDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

/**
 * @module PasswordResetService
 * @description
 * Service de gestion des opérations de réinitialisation de mot de passe.
 *
 * Fournit les méthodes pour demander une réinitialisation (envoi d’email)
 * et pour réinitialiser le mot de passe avec un token.
 */
@Injectable({ providedIn: 'root' })
export class PasswordResetService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.apiUrl;

  /**
   * Demande la réinitialisation du mot de passe en envoyant l’email de l’utilisateur.
   * @param dto Objet contenant l’email de l’utilisateur.
   * @returns Un Observable émettant un objet message.
   */
  requestPasswordReset(dto: PasswordResetDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/auth/request-password-reset`, dto);
  }

  /**
   * Réinitialise le mot de passe en utilisant un token de réinitialisation.
   * @param dto Objet contenant le token et le nouveau mot de passe.
   * @returns Un Observable émettant un objet message.
   */
  resetPassword(dto: ResetPasswordDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/auth/reset-password`, dto);
  }
}
