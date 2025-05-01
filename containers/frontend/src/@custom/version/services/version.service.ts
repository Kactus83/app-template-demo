import { Injectable } from '@angular/core';
import { VersionDto } from '../models/dto/version.dto';

/**
 * @service VersionService
 * @description Service pour la gestion des versions du frontend et du backend.
 *
 * Ce service centralise la configuration de la version du frontend utilisée dans l'application.
 * Il expose notamment la version du frontend via la méthode getFrontendVersion(), 
 * qui est utilisée lors de l'initialisation de l'application (ex. pour définir le cookie "frontend_version").
 *
 * La méthode getBackendVersion() permet de récupérer la version du backend, si elle est renseignée.
 */
@Injectable({
    providedIn: 'root',
})
export class VersionService {
    private version: VersionDto = {
        frontend: '1.0.0',
    };

    /**
     * Récupère la version actuelle du frontend.
     *
     * @returns {string} La version du frontend.
     */
    getFrontendVersion(): string {
        return this.version.frontend;
    }

    /**
     * Récupère la version actuelle du backend.
     *
     * @returns {string | undefined} La version du backend, ou undefined si non renseignée.
     */
    getBackendVersion(): string | undefined {
        return this.version.backend;
    }
}
