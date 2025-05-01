/**
 * @fileoverview Composant micro destiné à afficher le résumé du profil utilisateur.
 * Il affiche l'avatar (ou une icône par défaut), le nom et l'email de l'utilisateur.
 */

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDto } from '@custom/common/models/dto/user.dto';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector     : 'user-profile-summary',
    standalone   : true,
    imports      : [CommonModule, MatIconModule],
    templateUrl  : './user-profile-summary.component.html',
    styleUrls    : ['./user-profile-summary.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class UserProfileSummaryComponent implements OnInit
{
    /**
     * Utilisateur dont le résumé doit être affiché.
     */
    @Input() user!: UserDto;

    /**
     * Constructeur du composant.
     */
    constructor()
    {
        // Constructeur vide
    }

    /**
     * Cycle de vie du composant.
     */
    ngOnInit(): void
    {
        // Initialisation éventuelle
    }
}
