import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FuseAlertComponent,
    RouterLink
  ],
  animations: fuseAnimations
})
export class ForgotPasswordFormComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  showAlert: boolean = false;
  alert: { type: FuseAlertType; message: string } = { type: 'success', message: '' };

  constructor(private _formBuilder: FormBuilder, private _authService: AuthService) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Envoie la demande de réinitialisation de mot de passe.
   */
  sendResetLink(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    // Désactiver le formulaire et masquer l'alerte
    this.forgotPasswordForm.disable();
    this.showAlert = false;

    this._authService
      .forgotPassword(this.forgotPasswordForm.get('email')?.value)
      .pipe(
        finalize(() => {
          // Réactiver le formulaire et afficher l'alerte
          this.forgotPasswordForm.enable();
          this.showAlert = true;
        })
      )
      .subscribe({
        next: (response) => {
          this.alert = {
            type: 'success',
            message:
              "Password reset sent! You'll receive an email if you are registered on our system."
          };
        },
        error: (error) => {
          this.alert = {
            type: 'error',
            message: 'Email not found! Are you sure you are already a member?'
          };
        }
      });
  }
}
