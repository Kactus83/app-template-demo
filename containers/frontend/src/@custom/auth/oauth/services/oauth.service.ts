import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { AuthCoreService } from '@custom/auth/common/services/core-auth.service';
import { environment } from '../../../../../environment';
import { OAuthProvider } from '../types/oauth-provider.type';
import { LoginResponseDto } from '@custom/auth/common/types/login-response.dto';

/**
 * @module OAuthService
 * @description
 * Service de gestion de l'authentification OAuth.
 *
 * Ce service offre deux fonctionnalités principales :
 * - Lancer le flux OAuth en redirigeant l'utilisateur vers l'endpoint backend approprié.
 * - Traiter le callback OAuth, extraire le token et les informations utilisateur des paramètres d'URL,
 *   et mettre à jour l'état d'authentification via le CoreAuthService.
 */
@Injectable({ providedIn: 'root' })
export class OAuthService {
  private baseUrl: string = environment.apiUrl;

  constructor(private router: Router, private authCore: AuthCoreService) {}

  /**
   * Lance le flux OAuth en redirigeant l'utilisateur vers le backend.
   *
   * @param provider - Le fournisseur OAuth (google, github, facebook)
   */
  initiateOAuthLogin(provider: OAuthProvider): void {
    // Redirige l'utilisateur vers l'URL backend dédiée au fournisseur OAuth
    window.location.href = `${this.baseUrl}/auth/oauth/${provider}`;
  }

  /**
   * Traite le callback OAuth à partir des paramètres de l'URL.
   *
   * Extrait le token et les données utilisateur, met à jour l'état d'authentification
   * via CoreAuthService et retourne un Observable indiquant le succès du traitement.
   *
   * @param queryParams - Les paramètres de requête issus de l'URL du callback.
   * @returns Un Observable qui émet true en cas de succès ou une erreur sinon.
   */
  handleOAuthCallback(queryParams: any): Observable<boolean> {
    const token = queryParams.token;
    const userStr = queryParams.user;

    if (!token || !userStr) {
      return throwError(() => new Error('OAuth callback missing token or user data'));
    }

    try {
      // Décodage et parsing des données utilisateur reçues
      const user = JSON.parse(decodeURIComponent(userStr));
      const loginResponse: LoginResponseDto = { token, user };

      // Mise à jour de l'état authentifié via CoreAuthService
      this.authCore.updateAuthState(loginResponse);

      return of(true);
    } catch (error) {
      return throwError(() => error);
    }
  }
}
