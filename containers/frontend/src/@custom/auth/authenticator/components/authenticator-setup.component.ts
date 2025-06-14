import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { AuthenticatorService } from '../services/authenticator.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { finalize } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticatorDto } from '../models/dto/authenticator.dto';

/**
 * @component AuthenticatorSetupComponent
 * @description Permet de créer l’authenticator et d’afficher le QR code + formulaire d’activation.
 */
@Component({
  selector: 'custom-authenticator-setup',
  templateUrl: './authenticator-setup.component.html',
  styleUrls: ['./authenticator-setup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  animations: fuseAnimations,
})
export class AuthenticatorSetupComponent implements OnInit {
  /** Événement émis lors de l'activation réussie */
  @Output() authenticatorActivated = new EventEmitter<AuthenticatorDto>();

  loading = false;
  message = '';
  error = '';
  authenticator: AuthenticatorDto | null = null;
  activationForm: FormGroup;

  constructor(
    private authenticatorService: AuthenticatorService,
    private fb: FormBuilder
  ) {
    this.activationForm = this.fb.group({
      totpCode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAuthenticator();
  }

  /**
   * Charge l’authenticator existant ou le crée si inexistant (404).
   */
  loadAuthenticator(): void {
    this.loading = true;
    this.authenticatorService.getAuthenticator()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          this.authenticator = res.authenticator;
          if (this.authenticator && this.authenticator.enabled) {
            this.message = 'Authenticator is already activated.';
            // On notifie directement le parent si déjà activé
            this.authenticatorActivated.emit(this.authenticator);
          }
        },
        error: (err) => {
          if (err.status === 404) {
            // Crée le nouvel authenticator
            this.createAuthenticator();
          } else {
            this.error = err.error?.message || 'Unable to retrieve authenticator status.';
          }
        }
      });
  }

  /**
   * Crée un nouvel authenticator et récupère QR + secret.
   */
  createAuthenticator(): void {
    this.loading = true;
    this.authenticatorService.createAuthenticator()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          this.authenticator = res.authenticator;
          if (res.qrCodeUrl) {
            this.authenticator.qrCodeURL = res.qrCodeUrl;
          }
          this.message = typeof res.message === 'string'
            ? res.message
            : JSON.stringify(res.message);
          this.error = '';
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to create authenticator.';
          this.message = '';
        }
      });
  }

  /**
   * Active l’authenticator à partir du code TOTP saisi.
   */
  activateAuthenticator(): void {
    if (this.activationForm.invalid) {
      return;
    }
    const totpCode = this.activationForm.get('totpCode')?.value;
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
          // On notifie le parent pour passer en control
          this.authenticatorActivated.emit(this.authenticator!);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to activate authenticator.';
          this.message = '';
        }
      });
  }

  /**
   * Génère un nouveau QR + secret.
   */
  refreshAuthenticator(): void {
    this.createAuthenticator();
  }
}
