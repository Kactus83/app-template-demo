/**
 * @fileoverview Composant d'affichage de l'utilisateur dans le header,
 * incluant le menu déroulant pour accéder au profil, aux réglages et pour
 * modifier le statut utilisateur.
 */

import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector       : 'user',
    templateUrl    : './user.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'user',
    imports        : [
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        NgClass,
        MatDividerModule,
        RouterModule
    ],
})
export class UserComponent implements OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    /**
     * Détermine si l'avatar doit être affiché.
     */
    @Input() showAvatar: boolean = true;

    /**
     * Données de l'utilisateur.
     */
    user: User;

    /**
     * Sujet permettant de détruire toutes les subscriptions.
     */
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructeur avec injection des dépendances.
     *
     * @param _changeDetectorRef ChangeDetectorRef pour marquer les changements
     * @param _router            Router pour la navigation
     * @param _userService       Service utilisateur
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * Cycle de vie : initialisation.
     *
     * On s'abonne aux changements de l'utilisateur afin de mettre à jour l'affichage.
     */
    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
                // Demande de vérification du changement pour la détection OnPush
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Cycle de vie : destruction.
     *
     * Désabonne de toutes les subscriptions pour éviter les fuites de mémoire.
     */
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Met à jour le statut de l'utilisateur.
     *
     * @param status Nouveau statut de l'utilisateur
     */
    updateUserStatus(status: string): void {
        if (!this.user) {
            return;
        }

        this._userService
            .update({
                ...this.user,
                status,
            })
            .subscribe();
    }

    /**
     * Déclenche la déconnexion et redirige vers la page de sign out.
     */
    signOut(): void {
        this._router.navigate(['/sign-out']);
    }
}
