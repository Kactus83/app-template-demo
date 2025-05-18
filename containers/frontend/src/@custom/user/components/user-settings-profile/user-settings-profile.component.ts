import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule }   from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { UserService } from '@custom/user/services/user.service';
import { take }        from 'rxjs/operators';

@Component({
  selector: 'user-settings-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './user-settings-profile.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsProfileComponent implements OnInit
{
  profileForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  // Alert
  showAlert = false;
  alertType: 'success'|'error' = 'success';
  alertMessage = '';

  constructor(
    private _fb: FormBuilder,
    private _userService: UserService
  ) {
    this.profileForm = this._fb.group({
      firstName: ['', Validators.required],
      lastName:  ['', Validators.required],
      status:    [''],
    });
  }

  ngOnInit(): void {
    this._userService.getCurrentUser().pipe(take(1)).subscribe({
      next: user => {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName:  user.lastName,
          status:    user.status,
        });
        this.previewUrl = user.avatar;
      },
      error: () => this._showError('Impossible de charger le profil')
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = (e.target as any).result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  save(): void {
    if (this.profileForm.invalid) return;

    // 1) Met à jour les champs texte
    this._userService.updateUser(this.profileForm.value).pipe(take(1)).subscribe({
      next: () => {
        // 2) Si un avatar a été sélectionné, on l’upload
        if (this.selectedFile) {
          this._userService.updateAvatar(this.selectedFile).pipe(take(1)).subscribe({
            next: () => this._showSuccess('Profil et avatar mis à jour'),
            error: err => this._showError(err.error?.message || 'Erreur upload avatar')
          });
        } else {
          this._showSuccess('Profil mis à jour');
        }
      },
      error: err => this._showError(err.error?.message || 'Erreur mise à jour profil')
    });
  }

  private _showSuccess(msg: string) {
    this.alertType    = 'success';
    this.alertMessage = msg;
    this.showAlert    = true;
  }

  private _showError(msg: string) {
    this.alertType    = 'error';
    this.alertMessage = msg;
    this.showAlert    = true;
  }
}
