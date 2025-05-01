import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailTokenValidationService } from '../services/email-token-validation.service';
import { EmailTokenAction } from '../models/types/email.types';

/**
 * @component EmailTokenValidatorComponent
 * @description Composant micro pour valider un token d'email.
 *
 * Ce composant récupère le token depuis l'URL s'il est présent, et lance la validation automatiquement.
 * Sinon, il permet à l'utilisateur de saisir manuellement le token dans un champ.
 * Le champ est désactivé si le token est détecté dans l'URL.
 * Une fois la validation réussie, un message de succès est affiché, puis l'utilisateur est redirigé vers la page d'accueil après un délai.
 */
@Component({
  selector: 'custom-email-token-validator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './email-token-validator.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class EmailTokenValidatorComponent implements OnInit {
  @Input() action!: EmailTokenAction;
  token: string = '';
  tokenDetected: boolean = false;
  message: string = '';
  error: string = '';
  // Délai de redirection en millisecondes (ici 5 secondes)
  private readonly redirectionDelay = 5000;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tokenValidationService: EmailTokenValidationService
  ) {}

  ngOnInit(): void {
    const queryToken = this.route.snapshot.queryParamMap.get('token');
    if (queryToken) {
      this.token = queryToken;
      this.tokenDetected = true;
      this.validateToken();
    }
  }

  /**
   * Valide le token d'email.
   * Si le token est valide, affiche un message de succès et redirige l'utilisateur vers la page d'accueil.
   * Si le token est invalide, affiche un message d'erreur.
   */
  validateToken(): void {
    if (!this.token) {
      this.error = 'Please enter a token.';
      return;
    }
    this.tokenValidationService.validateToken(this.action, this.token)
      .subscribe({
        next: (res) => {
          this.message = res && res.message ? String(res.message) : 'Token validated successfully.';
          this.error = '';
          // Après un délai, rediriger vers la page d'accueil
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, this.redirectionDelay);
        },
        error: (err) => {
          this.error = (err && err.error && err.error.message)
            ? String(err.error.message)
            : (err && err.error ? String(err.error) : 'An error occurred during token validation.');
          this.message = '';
        }
      });
  }
}
