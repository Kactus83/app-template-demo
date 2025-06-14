import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
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
 * @description Affiche l’état courant et propose activation (si désactivé), désactivation et suppression.
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
  /** Événement émis lorsqu'on supprime l'authenticator */
  @Output() authenticatorDeleted = new EventEmitter<void>();

  loading = false;
  message = '';
  error = '';
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
    this.loadAuthenticator();
  }

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

  deleteAuthenticator(): void {
    this.loading = true;
    this.authenticatorService.deleteAuthenticator()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          this.message = res.message || 'Authenticator deleted successfully.';
          this.error = '';
          this.authenticator = null;
          // On notifie le parent pour revenir en setup
          this.authenticatorDeleted.emit();
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to delete authenticator.';
          this.message = '';
        }
      });
  }
}
