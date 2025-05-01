import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthenticatorService } from '../services/authenticator.service';
import { finalize } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticatorDto } from '../models/dto/authenticator.dto';

/**
 * @component AuthenticatorControlComponent
 * @description Permet d’afficher l’état courant de l’authenticator et de proposer
 * des actions de gestion (activation si non activé, désactivation, suppression) avec
 * éventuellement un champ de confirmation (TOTP code) pour ces opérations.
 */
@Component({
  selector: 'custom-authenticator-control',
  templateUrl: './authenticator-control.component.html',
  styleUrls: ['./authenticator-control.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  animations: fuseAnimations,
})
export class AuthenticatorControlComponent implements OnInit {
  loading: boolean = false;
  message: string = '';
  error: string = '';
  authenticator: AuthenticatorDto | null = null;
  controlForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authenticatorService: AuthenticatorService
  ) {
    this.controlForm = this.fb.group({
      totpCode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Charge l'état de l'authenticator
    this.loadAuthenticator();
  }

  /**
   * Charge l’authenticator depuis le backend.
   */
  loadAuthenticator(): void {
    this.loading = true;
    this.authenticatorService.getAuthenticator()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          this.authenticator = res.authenticator;
        },
        error: (err) => {
          this.error = err.error?.message || 'Unable to retrieve authenticator status.';
        }
      });
  }

  /**
   * Active l’authenticator en cas d’état non activé.
   */
  activateAuthenticator(): void {
    if (this.controlForm.invalid) {
      return;
    }
    const totpCode = this.controlForm.get('totpCode')?.value;
    this.loading = true;
    this.authenticatorService.enableAuthenticator(totpCode)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          if (this.authenticator) {
            this.authenticator.enabled = true;
          }
          this.message = res.message || 'Authenticator activated successfully.';
          this.error = '';
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to activate authenticator.';
          this.message = '';
        }
      });
  }

  /**
   * Désactive l’authenticator.
   * Le champ TOTP peut être utilisé en confirmation (actuellement non transmis à l’API).
   */
  disableAuthenticator(): void {
    this.loading = true;
    this.authenticatorService.disableAuthenticator()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          if (this.authenticator) {
            this.authenticator.enabled = false;
          }
          this.message = res.message || 'Authenticator disabled successfully.';
          this.error = '';
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to disable authenticator.';
          this.message = '';
        }
      });
  }

  /**
   * Supprime l’authenticator.
   * Le champ TOTP peut être utilisé en confirmation (actuellement non transmis à l’API).
   */
  deleteAuthenticator(): void {
    this.loading = true;
    this.authenticatorService.deleteAuthenticator()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          this.message = res.message || 'Authenticator deleted successfully.';
          this.error = '';
          // Réinitialise les données locales
          this.authenticator = null;
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to delete authenticator.';
          this.message = '';
        }
      });
  }
}
