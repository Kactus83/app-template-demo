import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Template,
  TemplateGlobalStats,
  TemplateUserStats,
} from './app-templates.types';
import { environment } from '../../../../environment';

/**
 * Service pour interagir avec le domaine Demo → AppTemplates.
 * Fournit le listing, le téléchargement et les statistiques.
 */
@Injectable({ providedIn: 'root' })
export class AppTemplatesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/app-templates`;

  // ---------------------------------------------------------------------------------------------------
  // @ Public methods
  // ---------------------------------------------------------------------------------------------------

  /**
   * Récupère la liste de **tous** les templates disponibles.
   */
  getAllTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(this.baseUrl);
  }

  /**
   * Récupère la liste des templates « attribués » à l’utilisateur connecté.
   */
  getUserTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(`${this.baseUrl}/me`);
  }

  /**
   * Télécharge le ZIP d’un template donné.
   * @param templateId ID du template à télécharger
   * @returns le blob binaire du fichier ZIP
   */
  downloadTemplate(templateId: number): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}/${templateId}/download`,
      { responseType: 'blob' }
    );
  }

  /**
   * Récupère les statistiques globales pour **tous** les templates.
   */
  getAllStats(): Observable<TemplateGlobalStats[]> {
    return this.http.get<TemplateGlobalStats[]>(
      `${this.baseUrl}/stats`
    );
  }

  /**
   * Récupère les statistiques de téléchargement pour un template donné,
   * ventilées par utilisateur.
   * @param templateId ID du template
   */
  getStatsForTemplate(
    templateId: number
  ): Observable<TemplateUserStats[]> {
    return this.http.get<TemplateUserStats[]>(
      `${this.baseUrl}/${templateId}/stats`
    );
  }
}
