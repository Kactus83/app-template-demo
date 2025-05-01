/**
 * @fileoverview Composant micro pour les réglages d'email de l'utilisateur.
 * Il affiche les formulaires de mise à jour de l'email primaire et secondaire,
 * en récupérant les valeurs via les Input, et en gérant les actions via les services.
 */

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EmailChangeService } from '@custom/auth/email/services/email-change.service';
import { UserDto } from '@custom/common/models/dto/user.dto';
import { SecondaryEmailService } from '@custom/auth/email/services/secondary-email.service';

@Component({
  selector: 'user-email-settings',
  templateUrl: './user-email-settings.component.html',
  styleUrls: ['./user-email-settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class UserEmailSettingsComponent implements OnInit {
  /**
   * Utilisateur pour lequel les réglages email sont affichés.
   */
  @Input() user!: UserDto;

  /**
   * Formulaire pour l'email primaire.
   */
  emailForm: FormGroup;

  /**
   * Formulaire pour l'email secondaire.
   */
  secondaryEmailForm: FormGroup;

  showPrimaryAlert: boolean = false;
  primaryAlertMessage: string = '';
  primaryAlertType: 'success' | 'error' = 'success';
  showSecondaryAlert: boolean = false;
  secondaryAlertMessage: string = '';
  secondaryAlertType: 'success' | 'error' = 'success';

  /**
   * Constructeur avec injection des services et du FormBuilder.
   * @param fb FormBuilder pour créer les formulaires
   * @param secondaryEmailService Service de gestion de l'email secondaire
   * @param emailChangeService Service de changement d'email
   */
  constructor(private fb: FormBuilder,
              private secondaryEmailService: SecondaryEmailService,
              private emailChangeService: EmailChangeService) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.secondaryEmailForm = this.fb.group({
      secondaryEmail: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Cycle de vie : initialisation du composant.
   * Patch les formulaires avec les données existantes si elles sont définies.
   */
  ngOnInit(): void {
    if (this.user?.email) {
      this.emailForm.patchValue({ email: this.user.email });
    }
    if (this.user?.secondaryEmail) {
      this.secondaryEmailForm.patchValue({ secondaryEmail: this.user.secondaryEmail });
    }
  }

  /**
   * Met à jour l'email primaire en appelant le service dédié.
   */
  updatePrimaryEmail(): void {
    if (this.emailForm.invalid) {
      return;
    }
    const newEmail = this.emailForm.get('email')?.value;
    this.emailChangeService.requestEmailChange(newEmail).subscribe({
      next: (res) => {
        this.primaryAlertType = 'success';
        this.primaryAlertMessage = res.message || 'Primary email change requested successfully.';
        this.showPrimaryAlert = true;
      },
      error: (err) => {
        this.primaryAlertType = 'error';
        this.primaryAlertMessage = err.error?.message || 'An error occurred while requesting primary email change.';
        this.showPrimaryAlert = true;
      }
    });
  }

  /**
   * Met à jour l'email secondaire en appelant le service dédié.
   */
  updateSecondaryEmail(): void {
    if (this.secondaryEmailForm.invalid) {
      return;
    }
    const newSecondaryEmail = this.secondaryEmailForm.get('secondaryEmail')?.value;
    this.secondaryEmailService.addSecondaryEmail(newSecondaryEmail).subscribe({
      next: (res) => {
        this.secondaryAlertType = 'success';
        this.secondaryAlertMessage = res.message || 'Secondary email updated successfully.';
        this.showSecondaryAlert = true;
      },
      error: (err) => {
        this.secondaryAlertType = 'error';
        this.secondaryAlertMessage = err.error?.message || 'An error occurred while updating secondary email.';
        this.showSecondaryAlert = true;
      }
    });
  }

  /**
   * Supprime l'email secondaire en appelant le service dédié.
   */
  deleteSecondaryEmail(): void {
    this.secondaryEmailService.deleteSecondaryEmail().subscribe({
      next: (res) => {
        this.secondaryAlertType = 'success';
        this.secondaryAlertMessage = res.message || 'Secondary email deleted successfully.';
        this.showSecondaryAlert = true;
      },
      error: (err) => {
        this.secondaryAlertType = 'error';
        this.secondaryAlertMessage = err.error?.message || 'An error occurred while deleting secondary email.';
        this.showSecondaryAlert = true;
      }
    });
  }
}
