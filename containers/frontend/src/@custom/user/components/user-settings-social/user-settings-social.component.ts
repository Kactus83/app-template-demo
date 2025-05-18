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
} from '@angular/forms';
import { MatButtonModule }     from '@angular/material/button';
import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatIconModule }       from '@angular/material/icon';
import { MatInputModule }      from '@angular/material/input';
import { UserService }         from '@custom/user/services/user.service';
import { take }                from 'rxjs/operators';

@Component({
  selector: 'user-settings-social',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './user-settings-social.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsSocialComponent implements OnInit {
  socialForm: FormGroup;

  showAlert = false;
  alertType: 'success'|'error' = 'success';
  alertMessage = '';

  constructor(
    private _fb: FormBuilder,
    private _userService: UserService
  ) {
    this.socialForm = this._fb.group({
      bio:         [''],
      twitterUrl:  [''],
      linkedInUrl: [''],
      facebookUrl: [''],
      bannerUrl:   [''],
    });
  }

  ngOnInit(): void {
    this._userService.getProfile().pipe(take(1)).subscribe({
      next: profile => this.socialForm.patchValue(profile),
      error: () => this._showError('Impossible de charger les réseaux sociaux')
    });
  }

  save(): void {
    this._userService.updateProfile(this.socialForm.value).pipe(take(1)).subscribe({
      next: () => this._showSuccess('Réseaux sociaux mis à jour'),
      error: err => this._showError(err.error?.message || 'Erreur mise à jour')
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
