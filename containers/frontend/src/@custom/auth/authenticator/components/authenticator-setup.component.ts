import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
 * @description Permet de créer l’authenticator et d’afficher simultanément le QR code ainsi
 * que le formulaire d’activation (saisie du code TOTP). Une fois activé, l’état est mis à jour.
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
  loading: boolean = false;
  message: string = '';
  error: string = '';
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
    // Charge l'authenticator existant ou le crée si inexistant
    this.loadAuthenticator();
  }

  /**
   * Charge l’authenticator depuis le backend.
   * En cas d'absence (404), il est créé automatiquement.
   */
  loadAuthenticator(): void {
    this.loading = true;
    this.authenticatorService.getAuthenticator()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          this.authenticator = res.authenticator;
          // Si l'authenticator est déjà activé, on indique le message
          if (this.authenticator && this.authenticator.enabled) {
            this.message = 'Authenticator is already activated.';
          }
        },
        error: (err) => {
          if (err.status === 404) {
            // Aucun authenticator trouvé, on le crée
            this.createAuthenticator();
          } else {
            this.error = err.error?.message || 'Unable to retrieve authenticator status.';
          }
        }
      });
  }

  /**
   * Crée un nouvel authenticator et récupère le QR code et le secret.
   */
  createAuthenticator(): void {
    this.loading = true;
    this.authenticatorService.createAuthenticator()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          this.authenticator = res.authenticator;
          // Gestion de la différence de casse entre 'qrCodeUrl' et 'qrCodeURL'
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
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to activate authenticator.';
          this.message = '';
        }
      });
  }

  /**
   * Permet de rafraîchir l’authenticator (génération d’un nouveau QR code et secret).
   */
  refreshAuthenticator(): void {
    this.createAuthenticator();
  }
}
