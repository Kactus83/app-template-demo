import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { EmailTokenValidatorComponent } from '@custom/auth/email/components/email-token-validator.component';
import { EmailTokenAction } from '@custom/auth/email/models/types/email.types';

/**
 * @component EmailConfirmationComponent
 * @description Composant wrapper pour la confirmation d'email.
 *
 * Ce composant fournit le layout complet de la page de confirmation d'email et intègre le micro‑composant
 * "custom-email-token-validator" pour valider le token. Il détermine l'action à effectuer (et ajuste
 * les textes affichés) en se basant sur le chemin de la route parente.
 */
@Component({
    selector: 'app-email-confirmation',
    standalone: true,
    imports: [CommonModule, RouterLink, EmailTokenValidatorComponent],
    templateUrl: './email-confirmation.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class EmailConfirmationComponent implements OnInit {
    title: string = '';
    description: string = '';
    action!: EmailTokenAction;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        // Récupère le chemin défini dans la route parente (défini dans appRoutes)
        const parentPath = this.route.parent?.routeConfig?.path || '';
        switch (parentPath) {
            case 'verify-email':
                this.title = 'Verify Your Email';
                this.description = 'Click the link in your email to verify your address and activate your account. If the token is not auto-detected, please enter it manually below.';
                this.action = EmailTokenAction.VERIFY_EMAIL;
                break;
            case 'confirm-email-change':
                this.title = 'Confirm Email Change';
                this.description = 'Click the link in your email to confirm your request to change your primary email address. If the token is not auto-detected, please enter it manually below.';
                this.action = EmailTokenAction.CONFIRM_EMAIL_CHANGE;
                break;
            case 'confirm-secondary-email-change':
                this.title = 'Confirm Secondary Email Change';
                this.description = 'Click the link in your email to confirm your request to change your secondary email address. If the token is not auto-detected, please enter it manually below.';
                this.action = EmailTokenAction.CONFIRM_SECONDARY_EMAIL_CHANGE;
                break;
            case 'confirm-secondary-email-deletion':
                this.title = 'Confirm Secondary Email Deletion';
                this.description = 'Click the link in your email to confirm the deletion of your secondary email address. If the token is not auto-detected, please enter it manually below.';
                this.action = EmailTokenAction.CONFIRM_SECONDARY_EMAIL_DELETION;
                break;
            default:
                this.title = 'Email Action';
                this.description = '';
                this.action = EmailTokenAction.VERIFY_EMAIL;
        }
    }
}
