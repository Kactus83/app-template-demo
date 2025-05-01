import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/core/user/user.service';
import { environment } from '../../../../../environment';

@Injectable({
  providedIn: 'root',
})
export class AuthCoreService {
  private _authenticated: boolean = false;
  private _baseUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}

  /**
   * Setter & getter pour le token d'accès
   */
  set accessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  /**
   * Permet de mettre à jour l'état authentifié et les informations utilisateur.
   * À appeler après une authentification réussie.
   */
  updateAuthState(response: { token: string; user: any }): void {
    this.accessToken = response.token;
    this._authenticated = true;
    this.userService.user = response.user;
  }

  /**
   * Permet de réinitialiser l'état authentifié lors de la déconnexion.
   */
  resetAuthState(): void {
    localStorage.removeItem('accessToken');
    this._authenticated = false;
  }

  /**
   * Vérifie si l'utilisateur est authentifié.
   */
  isAuthenticated(): boolean {
    // Vous pouvez ajouter ici une logique pour vérifier l'expiration du token, etc.
    return this._authenticated && !!this.accessToken;
  }

  get baseUrl(): string {
    return this._baseUrl;
  }
}
