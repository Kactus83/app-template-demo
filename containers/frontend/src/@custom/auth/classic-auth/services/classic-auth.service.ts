import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment';
import { AddEmailClassicAuthDto, AddUsernameClassicAuthDto } from '../models/dto/auth.dto';
import { UserDto } from '@custom/common/models/dto/user.dto';

/**
 * @module ClassicAuthService
 * @description
 * Service pour gérer l'ajout de l'authentification classique côté frontend.
 * Permet aux utilisateurs (inscrits via OAuth ou Web3) d'ajouter un email et un mot de passe.
 */
@Injectable({ providedIn: 'root' })
export class ClassicAuthService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.apiUrl;

  /**
   * Envoie une requête à l'endpoint pour ajouter l'authentification classique.
   * @param addClassicAuthDto Objet contenant l'email et le mot de passe.
   * @returns Un Observable émettant un UserDto épuré.
   */
  addClassicAuth(addClassicAuthDto: AddEmailClassicAuthDto | AddUsernameClassicAuthDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.baseUrl}/auth/add-classic-auth`, addClassicAuthDto);
  }
}
