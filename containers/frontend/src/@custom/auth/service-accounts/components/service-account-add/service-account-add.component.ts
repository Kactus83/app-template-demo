import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }    from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule }    from '@angular/material/chips';
import { MatSelectModule }   from '@angular/material/select';
import { MatButtonModule }   from '@angular/material/button';
import { MatIconModule }     from '@angular/material/icon';
import { Router }            from '@angular/router';
import { finalize }          from 'rxjs';
import { fuseAnimations }    from '@fuse/animations';

import {
  CreateServiceAccountDto,
  CreateServiceAccountScopeDto,
  ScopeTarget,
  ScopePermission,
} from '../../models/dto/service-accounts.dto';
import { ServiceAccountsService } from '../../services/service-accounts.service';

@Component({
  selector: 'custom-service-account-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './service-account-add.component.html',
  styleUrls: ['./service-accounts-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ServiceAccountAddComponent implements OnInit {
  form: FormGroup;
  isSubmitting = false;
  showAlert = false;
  alertType: 'success' | 'error' = 'success';
  alertMessage = '';

  /** Options pour les selects */
  scopeTargets: ScopeTarget[]     = ['AUTH', 'USER', 'BUSINESS'];
  scopePermissions: ScopePermission[] = ['READ', 'WRITE'];

  constructor(
    private fb: FormBuilder,
    private service: ServiceAccountsService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      validTo: [null],
      allowedIps: this.fb.array([]),
      scopes: this.fb.array([]),
    });
  }

  ngOnInit(): void {}

  get allowedIps(): FormArray {
    return this.form.get('allowedIps') as FormArray;
  }

  get scopes(): FormArray {
    return this.form.get('scopes') as FormArray;
  }

  addIp(): void {
    this.allowedIps.push(this.fb.control('', Validators.required));
  }

  removeIp(index: number): void {
    this.allowedIps.removeAt(index);
  }

  addScope(): void {
    this.scopes.push(
      this.fb.group({
        target:     [null, Validators.required],
        permission: [null, Validators.required],
      })
    );
  }

  removeScope(index: number): void {
    this.scopes.removeAt(index);
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.isSubmitting = true;

    // Construction manuelle du DTO pour éviter unknown[] et le spread
    const raw = this.form.value;
    const dto: CreateServiceAccountDto = {
      name: raw.name!,
      validTo: raw.validTo ? raw.validTo.toISOString() : undefined,
      allowedIps: raw.allowedIps as string[],
      scopes: raw.scopes as CreateServiceAccountScopeDto[],
    };

    this.service
      .create(dto)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.alertType = 'success';
          this.alertMessage = 'Service account créé';
          this.showAlert = true;
          this.router.navigate(['service-accounts']);
        },
        error: err => {
          this.alertType = 'error';
          this.alertMessage = err.error?.message || 'Erreur lors de la création';
          this.showAlert = true;
        }
      });
  }
}
