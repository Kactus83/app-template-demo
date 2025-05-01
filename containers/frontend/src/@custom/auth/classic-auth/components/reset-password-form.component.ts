import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { PasswordResetService, ResetPasswordDto } from '../services/password-reset.service';

@Component({
  selector: 'reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class ResetPasswordFormComponent implements OnInit, OnDestroy {
  resetPasswordForm: FormGroup;
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  tokenDetected: boolean = false;
  passwordFieldType: 'password' | 'text' = 'password';
  confirmPasswordFieldType: 'password' | 'text' = 'password';
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private readonly redirectionDelay = 5000;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private passwordResetService: PasswordResetService
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        token: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        passwordConfirm: ['', Validators.required]
      },
      { validators: this.mustMatch('newPassword', 'passwordConfirm') }
    );
  }

  ngOnInit(): void {
    const queryToken = this.route.snapshot.queryParamMap.get('token');
    if (queryToken) {
      this.resetPasswordForm.patchValue({ token: queryToken });
      this.tokenDetected = true;
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  togglePasswordVisibility(field: 'newPassword' | 'passwordConfirm'): void {
    if (field === 'newPassword') {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    } else {
      this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }
  }

  resetPassword(): void {
    if (this.resetPasswordForm.invalid) {
      return;
    }
    this.resetPasswordForm.disable();
    this.showAlert = false;

    const dto: ResetPasswordDto = {
      token: this.resetPasswordForm.get('token')?.value,
      newPassword: this.resetPasswordForm.get('newPassword')?.value,
    };

    this.passwordResetService.resetPassword(dto)
      .pipe(
        finalize(() => {
          this.resetPasswordForm.enable();
          this.showAlert = true;
        }),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe({
        next: (response) => {
          this.alertType = 'success';
          this.alertMessage = response.message || 'Your password has been reset successfully.';
          setTimeout(() => {
            this.router.navigate(['/sign-in']);
          }, this.redirectionDelay);
        },
        error: (err) => {
          this.alertType = 'error';
          this.alertMessage = err.error?.message || 'Something went wrong, please try again.';
        }
      });
  }
}
