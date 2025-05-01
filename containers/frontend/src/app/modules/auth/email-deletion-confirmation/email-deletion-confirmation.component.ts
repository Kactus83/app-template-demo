import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
/**
 * @component EmailDeletionConfirmationComponent
 * @description
 * Composant de page pour la validation de la suppression d'un email secondaire.
 * Il intègre le micro‑composant custom-secondary-email-deletion-confirm pour gérer la validation.
 */
@Component({
  selector: 'email-deletion-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink, customSecondaryEmailDeletionConfirmComponent],
  templateUrl: './email-deletion-confirmation.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class EmailDeletionConfirmationComponent implements OnInit {
  title: string = 'Confirm Email Deletion';
  description: string = 'Click the link in your email to confirm the deletion of your secondary email address. If the token is not auto-detected, please enter it manually below.';
  action: string = 'CONFIRM_SECONDARY_EMAIL_DELETION'; // Ce champ sera transmis au micro‑composant si nécessaire.

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // La récupération du token se fait dans le micro‑composant.
  }
}
