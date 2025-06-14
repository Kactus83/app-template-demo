import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment';
import { UserDto } from '@custom/common/models/dto/user.dto';

// DTOs côté frontend
export interface AddSecondaryEmailDto {
  secondaryEmail: string;
}

export interface ConfirmSecondaryEmailDeletionDto {
  token: string;
}

/**
 * @module SecondaryEmailService
 * @description
 * Service de gestion de l'email secondaire.
 *
 * Permet d'ajouter un email secondaire, de le supprimer, et de confirmer la suppression via un token.
 */
@Injectable({ providedIn: 'root' })
export class SecondaryEmailService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.apiUrl;

  /**
   * Ajoute un email secondaire à l'utilisateur authentifié.
   * @param secondaryEmail Le nouvel email secondaire.
   * @returns Un Observable émettant un objet contenant un message et le UserDto mis à jour.
   */
  addSecondaryEmail(secondaryEmail: string): Observable<{ message: string; user: UserDto }> {
    const dto: AddSecondaryEmailDto = { secondaryEmail };
    return this.http.post<{ message: string; user: UserDto }>(`${this.baseUrl}/auth/email/add-secondary-email`, dto);
  }

  /**
   * Supprime l'email secondaire de l'utilisateur authentifié.
   * @returns Un Observable émettant un objet contenant un message et le UserDto mis à jour.
   */
  deleteSecondaryEmail(): Observable<{ message: string; user: UserDto }> {
    return this.http.post<{ message: string; user: UserDto }>(`${this.baseUrl}/auth/email/delete-secondary-email`, {});
  }

  /**
   * Confirme la suppression de l'email secondaire avec un token.
   * @param token Le token de confirmation.
   * @returns Un Observable émettant un objet message.
   */
  confirmSecondaryEmailDeletion(token: string): Observable<{ message: string }> {
    const dto: ConfirmSecondaryEmailDeletionDto = { token };
    return this.http.post<{ message: string }>(`${this.baseUrl}/auth/email/confirm-secondary-email-change`, dto);
  }
}
