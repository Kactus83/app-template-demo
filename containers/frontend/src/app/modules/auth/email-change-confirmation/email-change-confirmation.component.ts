import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';

/**
 * @component EmailChangeConfirmationComponent
 * @description
 * Composant de page pour la validation d'une demande de changement d'email.
 * Il sert de wrapper et intègre le micro‑composant custom-email-change-confirm.
 */
@Component({
  selector: 'email-change-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink, customEmailChangeConfirmComponent],
  templateUrl: './email-change-confirmation.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class EmailChangeConfirmationComponent implements OnInit {
  title: string = 'Confirm Email Change';
  description: string = 'Click the link in your email to confirm your request to change your email address. If the token is not auto-detected, please enter it manually below.';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // La logique de récupération du token se fait dans le micro‑composant.
  }
}
