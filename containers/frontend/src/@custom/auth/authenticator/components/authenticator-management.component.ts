import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticatorService } from '../services/authenticator.service';
import { take, catchError, finalize } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthenticatorSetupComponent } from './authenticator-setup.component';
import { AuthenticatorControlComponent } from './authenticator-control.component';
import { AuthenticatorDto } from '../models/dto/authenticator.dto';

/**
 * Composant de gestion de l'authenticator : affiche soit l'étape de setup (création/activation),
 * soit le contrôle, en fonction de l'état activé de l'authenticator.
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
  /** Indique si l'authenticator est activé */
  hasAuthenticatorEnabled = false;
  /** Indique si la vérification est en cours */
  loading = true;
  /** Message d'erreur */
  error = '';

  constructor(private authenticatorService: AuthenticatorService) {}

  ngOnInit(): void {
    this.checkAuthenticator();
  }

  /**
   * Vérifie l'état de l'authenticator.
   * - 404 => aucun authenticator => hasAuthenticatorEnabled = false
   * - authenticator.enabled => hasAuthenticatorEnabled = true
   */
  checkAuthenticator(): void {
    this.loading = true;
    this.error = '';
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
          this.hasAuthenticatorEnabled = !!res.authenticator && !!res.authenticator.enabled;
        },
        error: err => {
          this.error = err.error?.message || 'Unable to retrieve authenticator status';
        }
      });
  }

  /**
   * Appelé lorsque le setup a activé l'authenticator.
   */
  onAuthenticatorActivated(dto: AuthenticatorDto): void {
    this.hasAuthenticatorEnabled = true;
    this.error = '';
  }

  /**
   * Appelé lorsque le control a supprimé l'authenticator.
   */
  onAuthenticatorDeleted(): void {
    this.hasAuthenticatorEnabled = false;
    this.error = '';
  }
}
