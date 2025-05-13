import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment';
import {
  CreateServiceAccountDto,
  UpdateServiceAccountDto,
  ServiceAccountDto,
  CreateServiceAccountResponseDto,
} from '../models/dto/service-accounts.dto';

/**
 * Service Angular pour le module Service Accounts.
 * Gère l’appel aux endpoints CRUD + rotation de secret.
 */
@Injectable({ providedIn: 'root' })
export class ServiceAccountsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * Crée un nouveau Service Account.
   */
  create(
    dto: CreateServiceAccountDto,
  ): Observable<CreateServiceAccountResponseDto> {
    return this.http.post<CreateServiceAccountResponseDto>(
      `${this.baseUrl}/service-accounts`,
      dto,
    );
  }

  /**
   * Liste tous les Service Accounts de l’utilisateur connecté.
   */
  list(): Observable<ServiceAccountDto[]> {
    return this.http.get<ServiceAccountDto[]>(
      `${this.baseUrl}/service-accounts`,
    );
  }

  /**
   * Met à jour un Service Account existant.
   * @param id UUID du compte
   * @param dto Payload de mise à jour
   */
  update(
    id: string,
    dto: UpdateServiceAccountDto,
  ): Observable<ServiceAccountDto> {
    return this.http.put<ServiceAccountDto>(
      `${this.baseUrl}/service-accounts/${id}`,
      dto,
    );
  }

  /**
   * Révoque (supprime) un Service Account.
   * @param id UUID du compte
   */
  revoke(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/service-accounts/${id}`,
    );
  }

  /**
   * Tourne le secret d’un Service Account et retourne le nouveau secret brut.
   * @param id UUID du compte
   */
  rotate(id: string): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>(
      `${this.baseUrl}/service-accounts/${id}/rotate`,
      {},
    );
  }
}