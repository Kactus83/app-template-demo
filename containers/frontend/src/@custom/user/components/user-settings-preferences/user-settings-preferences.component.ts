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

import { TranslocoService } from '@jsverse/transloco';
import { take }             from 'rxjs/operators';

import { UserService }      from '@custom/user/services/user.service';

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
/**
 * Composant pour la gestion des préférences utilisateur : 
 * langue, fuseau horaire et thème.
 * Charge dynamiquement les options depuis Transloco et gère
 * l'enregistrement via l'API utilisateur.
 */
export class UserSettingsPreferencesComponent implements OnInit {
  /** Formulaire réactif pour les préférences */
  prefForm: FormGroup;

  /** Affichage de l’alerte de résultat */
  showAlert = false;
  alertType: 'success' | 'error' = 'success';
  alertMessage = '';

  /** Liste des langues récupérées dynamiquement */
  locales: string[] = [];

  /** Liste des fuseaux horaires */
  timezones: string[] = [];

  /** Thèmes disponibles (static) */
  themes = ['light', 'dark'];

  /**
   * Initialise le formulaire et injecte les services nécessaires.
   *
   * @param _fb Factory pour créer le FormGroup réactif.
   * @param _userService Service pour récupérer et mettre à jour les préférences utilisateur.
   * @param _translocoService Service de traduction pour obtenir les langues disponibles.
   */
  constructor(
    private _fb: FormBuilder,
    private _userService: UserService,
    private _translocoService: TranslocoService
  ) {
    this.prefForm = this._fb.group({
      locale:   ['', Validators.required],
      timezone: ['', Validators.required],
      theme:    ['', Validators.required],
    });
  }

  /**
   * Chargement initial des options (langues, fuseaux horaires)
   * et récupération des préférences existantes depuis l’API.
   */
  ngOnInit(): void {
    // Récupération dynamique des langues configurées dans Transloco
    const langs = this._translocoService.getAvailableLangs();
    this.locales = Array.isArray(langs)
      ? langs.map(lang => typeof lang === 'string' ? lang : lang.id)
      : []; 

    // Chargement des fuseaux horaires via l'API Intl (fallback statique)
    this.timezones = (Intl as any).supportedValuesOf?.('timeZone')
      ?? ['UTC', 'Europe/Paris', 'America/New_York'];

    // Chargement des préférences utilisateur existantes
    this._userService.getPreferences()
      .pipe(take(1))
      .subscribe({
        next: prefs => this.prefForm.patchValue(prefs),
        error: () => this._showError('Impossible de charger les préférences')
      });
  }

  /**
   * Soumet les préférences modifiées à l'API.
   * Affiche un message de succès ou d'erreur selon le résultat.
   */
  save(): void {
    if (this.prefForm.invalid) {
      this._showError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this._userService.updatePreferences(this.prefForm.value)
      .pipe(take(1))
      .subscribe({
        next: () => this._showSuccess('Préférences mises à jour'),
        error: err => this._showError(err.error?.message || 'Erreur mise à jour')
      });
  }

  /**
   * Affiche une alerte de succès avec le message fourni.
   *
   * @param msg Message à afficher.
   * @private
   */
  private _showSuccess(msg: string): void {
    this.alertType    = 'success';
    this.alertMessage = msg;
    this.showAlert    = true;
  }

  /**
   * Affiche une alerte d'erreur avec le message fourni.
   *
   * @param msg Message à afficher.
   * @private
   */
  private _showError(msg: string): void {
    this.alertType    = 'error';
    this.alertMessage = msg;
    this.showAlert    = true;
  }
}
