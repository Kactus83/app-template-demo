import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticatorService } from '../services/authenticator.service';
import { take, finalize, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthenticatorSetupComponent } from './authenticator-setup.component';
import { AuthenticatorControlComponent } from './authenticator-control.component';

/**
 * Composant de gestion de l'authenticator : affiche soit l'étape de setup, soit le
 * contrôle, en fonction de l'existence de l'authenticator.
 */
@Component({
  selector: 'custom-authenticator-management',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterLink,
    AuthenticatorSetupComponent,
    AuthenticatorControlComponent
  ],
  templateUrl: './authenticator-management.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AuthenticatorManagementComponent implements OnInit {
  /** Indique si un authenticator est configuré */
  hasAuthenticator = false;
  /** Indique si la vérification est en cours */
  loading = true;
  /** Message d'erreur */
  error = '';

  constructor(private authenticatorService: AuthenticatorService) {}

  ngOnInit(): void {
    this.checkAuthenticator();
  }

  /**
   * Vérifie la présence d'un authenticator configuré.
   * - Si 404, on émet {authenticator: null} pour bypasser l'erreur.
   * - Toute autre erreur est remontée.
   */
  checkAuthenticator(): void {
    this.error = '';
    this.hasAuthenticator = false;

    this.authenticatorService.getAuthenticator()
      .pipe(
        take(1),
        catchError(err => {
          if (err.status === 404) {
            return of({ authenticator: null });
          }
          return throwError(() => err);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: res => {
          this.hasAuthenticator = !!res.authenticator;
        },
        error: err => {
          this.error = err.error?.message || 'Unable to retrieve authenticator status';
        }
      });
  }
}
