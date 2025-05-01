/**
 * @fileoverview Composant de haut niveau pour les réglages utilisateur.
 * Ce composant récupère l'utilisateur via le service et gère un système d'onglets.
 * Pour l'instant, l'onglet "Email" était implémenté, nous y avons ajouté "Phone" et "Authenticator".
 */

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { UserDto } from '@custom/common/models/dto/user.dto';
import { UserEmailSettingsComponent } from '@custom/user/email/user-email-settings.component';
import { CommonModule } from '@angular/common';
import { PhoneManagementComponent } from '@custom/auth/phone/components/phone-management.component';
import { AuthenticatorManagementComponent } from '@custom/auth/authenticator/components/authenticator-management.component';

@Component({
    selector     : 'user-settings',
    standalone   : true,
    imports      : [
        UserEmailSettingsComponent,
        PhoneManagementComponent,
        AuthenticatorManagementComponent,
        CommonModule
    ],
    templateUrl  : './user-settings.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class UserSettingsComponent implements OnInit
{
    /**
     * Données de l'utilisateur.
     */
    user!: UserDto;

    /**
     * Onglet actif. Pour l'instant, seule la vue "email" était implémentée.
     */
    activeTab: string = 'email';

    /**
     * Constructeur avec injection du service utilisateur.
     * @param _userService Service permettant de récupérer les informations utilisateur.
     */
    constructor(private _userService: UserService)
    {
    }

    /**
     * Cycle de vie : initialisation du composant.
     */
    ngOnInit(): void
    {
        this._userService.get().subscribe((user: UserDto) => {
            this.user = user;
        });
    }

    /**
     * Définit l'onglet actif.
     * @param tab Nom de l'onglet à activer.
     */
    setActiveTab(tab: string): void
    {
        this.activeTab = tab;
    }
}
