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
import { MatButtonModule }    from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule }      from '@angular/material/icon';
import { MatInputModule }     from '@angular/material/input';
import { MatSelectModule }    from '@angular/material/select';

import { UserService } from '@custom/user/services/user.service';
import { take }        from 'rxjs/operators';

@Component({
  selector: 'user-settings-preferences',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './user-settings-preferences.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsPreferencesComponent implements OnInit {
  prefForm: FormGroup;

  showAlert = false;
  alertType: 'success'|'error' = 'success';
  alertMessage = '';

  // Exemples d’options, à ajuster
  themes = ['light','dark'];
  locales = ['en','en-GB','fr','es','de'];
  timezones = ['UTC','Europe/Paris','America/New_York'];

  constructor(
    private _fb: FormBuilder,
    private _userService: UserService
  ) {
    this.prefForm = this._fb.group({
      locale:   ['','Validators.required'],
      timezone: ['','Validators.required'],
      theme:    ['','Validators.required'],
    });
  }

  ngOnInit(): void {
    this._userService.getPreferences().pipe(take(1)).subscribe({
      next: prefs => this.prefForm.patchValue(prefs),
      error: () => this._showError('Impossible de charger les préférences')
    });
  }

  save(): void {
    this._userService.updatePreferences(this.prefForm.value).pipe(take(1)).subscribe({
      next: () => this._showSuccess('Préférences mises à jour'),
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
