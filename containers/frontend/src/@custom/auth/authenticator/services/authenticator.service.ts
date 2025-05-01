import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment';
import { AuthenticatorDto, UpdateAuthenticatorDto } from '../models/dto/authenticator.dto';

/**
 * @module AuthenticatorService
 * @description Service de gestion de l'authenticator.
 *
 * Fournit des méthodes pour créer, activer, désactiver, supprimer, récupérer et mettre à jour l'authenticator.
 * Les endpoints utilisés correspondent aux routes du backend sous le préfixe `/auth/authenticator`.
 */
@Injectable({ providedIn: 'root' })
export class AuthenticatorService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.apiUrl;

  /**
   * Crée un nouvel authenticator et génère l'URL du QR code.
   * @returns Un Observable émettant un objet contenant un message, l'authenticator créé et l'URL du QR code.
   */
  createAuthenticator(): Observable<{ message: string; authenticator: AuthenticatorDto; qrCodeUrl: string }> {
    return this.http.post<{ message: string; authenticator: AuthenticatorDto; qrCodeUrl: string }>(`${this.baseUrl}/auth/authenticator`, {});
  }

  /**
   * Active l'authenticator en validant un code TOTP.
   * @param totpCode - Le code TOTP à valider.
   * @returns Un Observable émettant un objet contenant un message et l'authenticator mis à jour.
   */
  enableAuthenticator(totpCode: string): Observable<{ message: string; authenticator: AuthenticatorDto }> {
    return this.http.put<{ message: string; authenticator: AuthenticatorDto }>(`${this.baseUrl}/auth/authenticator/enable`, { totpCode });
  }

  /**
   * Désactive l'authenticator.
   * @returns Un Observable émettant un objet contenant un message et l'authenticator mis à jour.
   */
  disableAuthenticator(): Observable<{ message: string; authenticator: AuthenticatorDto }> {
    return this.http.put<{ message: string; authenticator: AuthenticatorDto }>(`${this.baseUrl}/auth/authenticator/disable`, {});
  }

  /**
   * Supprime l'authenticator.
   * @returns Un Observable émettant un objet contenant un message.
   */
  deleteAuthenticator(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/auth/authenticator`);
  }

  /**
   * Récupère l'authenticator de l'utilisateur.
   * @returns Un Observable émettant un objet contenant l'authenticator.
   */
  getAuthenticator(): Observable<{ authenticator: AuthenticatorDto }> {
    return this.http.get<{ authenticator: AuthenticatorDto }>(`${this.baseUrl}/auth/authenticator`);
  }

  /**
   * Met à jour le secret de l'authenticator.
   * @param newSecret - Le nouveau secret à utiliser.
   * @returns Un Observable émettant un objet contenant un message et l'authenticator mis à jour.
   */
  updateAuthenticatorSecret(newSecret: string): Observable<{ message: string; authenticator: AuthenticatorDto }> {
    return this.http.put<{ message: string; authenticator: AuthenticatorDto }>(`${this.baseUrl}/auth/authenticator/secret`, { newSecret });
  }
}
