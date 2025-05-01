import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticatorService } from '../services/authenticator.service';
import { Observable, of } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthenticatorSetupComponent } from './authenticator-setup.component';
import { AuthenticatorControlComponent } from './authenticator-control.component';

@Component({
  selector: 'custom-authenticator-management',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink, AuthenticatorSetupComponent, AuthenticatorControlComponent],
  templateUrl: './authenticator-management.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AuthenticatorManagementComponent implements OnInit {
  hasAuthenticator: boolean = false;
  loading: boolean = false;
  error: string = '';

  constructor(private authenticatorService: AuthenticatorService) {}

  ngOnInit(): void {
    this.checkAuthenticator();
  }

  /**
   * Vérifie si un authenticator est déjà configuré pour l'utilisateur.
   */
  checkAuthenticator(): void {
    this.loading = true;
    this.authenticatorService.getAuthenticator().subscribe({
      next: (res) => {
        // Si un authenticator est retourné, on considère qu'il est configuré.
        this.hasAuthenticator = !!res.authenticator;
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          // En cas de 404, on considère que l'authenticator n'existe pas : on affiche le setup.
          this.hasAuthenticator = false;
          this.error = '';
        } else {
          this.error = err.error?.message || 'Unable to retrieve authenticator status';
        }
        this.loading = false;
      }
    });
  }
  
}
