/**
 * @fileoverview Composant de haut niveau pour afficher le profil utilisateur.
 * Ce composant récupère l'utilisateur via le service et intègre le micro composant
 * user-profile-summary pour afficher un résumé du profil.
 */

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { UserDto } from '@custom/common/models/dto/user.dto';
import { UserProfileSummaryComponent } from '@custom/user/profile/user-profile-summary.component';

@Component({
    selector     : 'user-profile',
    standalone   : true,
    imports      : [UserProfileSummaryComponent],
    templateUrl  : './user-profile.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class UserProfileComponent implements OnInit
{
    /**
     * Données de l'utilisateur.
     */
    user!: UserDto;

    /**
     * Constructeur avec injection du service utilisateur.
     * @param _userService Service permettant de récupérer les informations utilisateur.
     */
    constructor(private _userService: UserService)
    {
    }

    /**
     * Cycle de vie : initialisation du composant.
     * On récupère l'utilisateur à l'initialisation.
     */
    ngOnInit(): void
    {
        this._userService.get().subscribe((user: UserDto) => {
            this.user = user;
        });
    }
}
