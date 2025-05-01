import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment';
import { AddPhoneDto, UpdatePhoneDto, VerifyPhoneDto, PhoneDto } from '../models/dto/phone.dto';

/**
 * @module PhoneService
 * @description
 * Service de gestion des numéros de téléphone pour l'utilisateur.
 *
 * Fournit des méthodes pour ajouter, vérifier, mettre à jour, supprimer et récupérer les numéros de téléphone.
 * Les endpoints utilisés correspondent aux routes définies dans votre module backend (préfixe `/auth/phone`).
 */
@Injectable({ providedIn: 'root' })
export class PhoneService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.apiUrl;

  /**
   * Ajoute un numéro de téléphone.
   * @param dto - DTO contenant le numéro de téléphone à ajouter.
   * @returns Un Observable émettant un objet avec un message et le numéro ajouté.
   */
  addPhone(dto: AddPhoneDto): Observable<{ message: string; phone: PhoneDto }> {
    return this.http.post<{ message: string; phone: PhoneDto }>(`${this.baseUrl}/auth/phone`, dto);
  }

  /**
   * Vérifie un numéro de téléphone avec un token.
   * @param dto - DTO contenant le numéro de téléphone et le token de vérification.
   * @returns Un Observable émettant un objet avec un message et le numéro vérifié.
   */
  verifyPhone(dto: VerifyPhoneDto): Observable<{ message: string; phone: PhoneDto }> {
    return this.http.post<{ message: string; phone: PhoneDto }>(`${this.baseUrl}/auth/phone/verify`, dto);
  }

  /**
   * Met à jour un numéro de téléphone.
   * @param id - L'identifiant du numéro de téléphone à mettre à jour.
   * @param dto - DTO contenant les informations à mettre à jour.
   * @returns Un Observable émettant un objet avec un message et le numéro mis à jour.
   */
  updatePhone(id: number, dto: UpdatePhoneDto): Observable<{ message: string; phone: PhoneDto }> {
    return this.http.put<{ message: string; phone: PhoneDto }>(`${this.baseUrl}/auth/phone/${id}`, dto);
  }

  /**
   * Supprime un numéro de téléphone.
   * @param id - L'identifiant du numéro de téléphone à supprimer.
   * @returns Un Observable émettant un objet avec un message et le numéro supprimé.
   */
  deletePhone(id: number): Observable<{ message: string; phone: PhoneDto }> {
    return this.http.delete<{ message: string; phone: PhoneDto }>(`${this.baseUrl}/auth/phone/${id}`);
  }

  /**
   * Récupère tous les numéros de téléphone de l'utilisateur.
   * @returns Un Observable émettant un objet contenant la liste des numéros.
   */
  getAllPhones(): Observable<{ phones: PhoneDto[] }> {
    return this.http.get<{ phones: PhoneDto[] }>(`${this.baseUrl}/auth/phone`);
  }
}
