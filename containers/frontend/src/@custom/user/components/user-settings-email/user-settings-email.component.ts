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
import { MatIconModule }      from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatDividerModule }   from '@angular/material/divider';

import { UserService }            from '@custom/user/services/user.service';
import { EmailChangeService }     from '@custom/auth/email/services/email-change.service';
import { SecondaryEmailService }  from '@custom/auth/email/services/secondary-email.service';
import { take }                   from 'rxjs/operators';
import { UserDto }                from '@custom/common/models/dto/user.dto';

@Component({
  selector: 'user-settings-email',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './user-settings-email.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsEmailComponent implements OnInit {
  user!: UserDto;

  // Forms
  primaryForm   : FormGroup;
  secondaryForm : FormGroup;
  editingSecondary = false;

  // Alerts
  showAlert = false;
  alertType: 'success'|'error' = 'success';
  alertMessage = '';

  constructor(
    private _fb: FormBuilder,
    private _userService: UserService,
    private _emailChange: EmailChangeService,
    private _secondary: SecondaryEmailService
  ) {
    this.primaryForm = this._fb.group({
      newEmail: ['', [Validators.required, Validators.email]]
    });
    this.secondaryForm = this._fb.group({
      secondaryEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Charge l'utilisateur puis initialise le formulaire
    this._userService.getCurrentUser().pipe(take(1)).subscribe(user => {
      this.user = user;
      this.primaryForm.setValue({ newEmail: user.email || '' });
    });
  }

  /** Rafraîchir user après add/delete secondaire */
  private _reloadUser() {
    this._userService.getCurrentUser().pipe(take(1)).subscribe(user => {
      this.user = user;
      this.editingSecondary = false;
      this.secondaryForm.reset();
    });
  }

  /** Centralise l'alerte */
  private _alert(type: 'success'|'error', msg: string) {
    this.alertType    = type;
    this.alertMessage = msg;
    this.showAlert    = true;
  }

  /** Demande de changement d’email principal */
  changePrimary() {
    if (this.primaryForm.invalid) return;
    const { newEmail } = this.primaryForm.value;
    this._emailChange.requestEmailChange(newEmail).pipe(take(1)).subscribe({
      next: res => this._alert('success', res.message),
      error: err => this._alert('error', err.error?.message || 'Erreur demande email')
    });
  }

  /** Bascule l'édition de l'email secondaire */
  toggleSecondaryEdit() {
    this.editingSecondary = !this.editingSecondary;
  }

  /** Ajout / modification de l'email secondaire */
  saveSecondary() {
    if (this.secondaryForm.invalid) return;
    const { secondaryEmail } = this.secondaryForm.value;
    this._secondary.addSecondaryEmail(secondaryEmail).pipe(take(1)).subscribe({
      next: res => {
        this._alert('success', res.message);
        this._reloadUser();
      },
      error: err => this._alert('error', err.error?.message || 'Erreur ajout secondaire')
    });
  }

  /** Suppression de l'email secondaire */
  deleteSecondary() {
    this._secondary.deleteSecondaryEmail().pipe(take(1)).subscribe({
      next: res => {
        this._alert('success', res.message);
        this._reloadUser();
      },
      error: err => this._alert('error', err.error?.message || 'Erreur suppression secondaire')
    });
  }
}
