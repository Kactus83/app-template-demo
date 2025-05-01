import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomOAuthCallbackComponent } from '@custom/auth/oauth/components/custom-oauth-callback.component';
import { fuseAnimations } from '@fuse/animations';

/**
 * @class AuthOAuthCallbackComponent
 * @description
 * Page complète qui héberge le composant `CustomOAuthCallbackComponent`.
 * Elle copie la structure de `confirmation-required.component.ts`, mais
 * contient le <custom-oauth-callback> pour gérer la logique OAuth.
 */
@Component({
    selector: 'auth-oauth-callback',
    templateUrl: './oauth-callback.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [RouterLink, CommonModule, CustomOAuthCallbackComponent],
})
export class AuthOAuthCallbackComponent
{
    /**
     * Constructor
     */
    constructor() {}
}
