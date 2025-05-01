import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, defaultIfEmpty, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { LoginDto, RegisterDto, ResetPasswordDto } from '@custom/auth/classic-auth/models/dto/auth.dto';
import { AuthCoreService } from '@custom/auth/common/services/core-auth.service';

/**
 * @module AuthService
 * @description
 * Service d'authentification qui délègue la gestion du token et de l'état utilisateur au CoreAuthService.
 *
 * Ce service propose des méthodes pour la connexion, la déconnexion, l'inscription, la réinitialisation du mot de passe,
 * et la vérification de l'état d'authentification, en s'appuyant sur la logique centralisée définie dans CoreAuthService.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private _httpClient = inject(HttpClient);
  private _authCore = inject(AuthCoreService);

  /**
   * Forgot password
   *
   * @param email - Adresse email de l'utilisateur
   * @returns Un Observable du résultat de la requête
   */
  forgotPassword(email: string): Observable<any> {
    // Envoi de l'email dans un objet pour plus de clarté côté backend
    return this._httpClient.post(`${this._authCore.baseUrl}/auth/forgot-password`, { email });
  }

  /**
   * Reset password
   *
   * @param dto - Objet contenant { token, newPassword }
   * @returns Un Observable du résultat de la requête
   */
  resetPassword(dto: ResetPasswordDto): Observable<any> {
    return this._httpClient.post(`${this._authCore.baseUrl}/auth/reset-password`, dto);
  }

  /**
   * Sign in
   *
   * @param credentials - LoginDto contenant email et password
   * @returns Un Observable de la réponse serveur
   */
  signIn(credentials: LoginDto): Observable<any> {
    if (this._authCore.isAuthenticated()) {
      return throwError(() => 'User is already logged in.');
    }

    return this._httpClient.post(`${this._authCore.baseUrl}/auth/sign-in`, credentials).pipe(
      switchMap((response: any) => {
        // Mise à jour de l'état authentifié via CoreAuthService
        this._authCore.updateAuthState(response);
        return of(response);
      })
    );
  }

  /**
   * Sign in using the access token
   *
   * @returns Un Observable indiquant si l'authentification par token a réussi
   */
  signInUsingToken(): Observable<any> {
    return this._httpClient.post(`${this._authCore.baseUrl}/auth/sign-in-with-token`, {
      accessToken: this._authCore.accessToken,
    }).pipe(
      // Si le HTTP call n’émet rien, émettez false par défaut
      defaultIfEmpty(false),
      catchError(() => of(false)),
      switchMap((response: any) => {
        // Vérifier que le response est défini et contient bien les données attendues
        if (response && response.accessToken) {
          this._authCore.accessToken = response.token;
          this._authCore.updateAuthState(response);
          return of(true);
        }
        return of(false);
      })
    );
  }

  /**
   * Sign out
   *
   * @returns Un Observable indiquant la réussite de la déconnexion
   */
  signOut(): Observable<any> {
    this._authCore.resetAuthState();
    return of(true);
  }

  /**
   * Sign up
   *
   * @param user - RegisterDto contenant email, password, name et éventuellement secondaryEmail
   * @returns Un Observable de la réponse serveur
   */
  signUp(user: RegisterDto): Observable<any> {
    return this._httpClient.post(`${this._authCore.baseUrl}/auth/sign-up`, user);
  }

  /**
   * Unlock session
   *
   * @param credentials - Objet contenant { email, password }
   * @returns Un Observable du résultat de la requête
   */
  unlockSession(credentials: { email: string; password: string }): Observable<any> {
    return this._httpClient.post(`${this._authCore.baseUrl}/auth/unlock-session`, credentials);
  }

  /**
   * Check the authentication status
   *
   * @returns Un Observable indiquant si l'utilisateur est authentifié
   */
  check(): Observable<boolean> {
    if (this._authCore.isAuthenticated()) {
      console.log('check() -> authenticated true');
      return of(true);
    }
    if (!this._authCore.accessToken) {
      console.log('check() -> no token, returning false');
      return of(false);
    }
    if (AuthUtils.isTokenExpired(this._authCore.accessToken)) {
      console.log('check() -> token expired, returning false');
      return of(false);
    }
    console.log('check() -> calling signInUsingToken()');
    return this.signInUsingToken();
  }  
}
