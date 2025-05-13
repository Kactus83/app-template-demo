import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
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
import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule }      from '@angular/material/chips';
import { MatSelectModule }     from '@angular/material/select';
import { MatButtonModule }     from '@angular/material/button';
import { MatIconModule }       from '@angular/material/icon';
import { finalize }            from 'rxjs';
import { fuseAnimations }      from '@fuse/animations';

import {
  UpdateServiceAccountDto,
  CreateServiceAccountScopeDto,
  ScopeTarget,
  ScopePermission,
} from '../../models/dto/service-accounts.dto';
import { ServiceAccountsService } from '../../services/service-accounts.service';

@Component({
  selector: 'custom-service-account-edit',
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
  templateUrl: './service-account-edit.component.html',
  styleUrls: ['./service-accounts-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ServiceAccountEditComponent implements OnInit {
  @Input()  id!: string;
  @Output() updated = new EventEmitter<void>();
  @Output() cancel  = new EventEmitter<void>();

  form: FormGroup;
  isLoading = false;
  isSubmitting = false;

  scopeTargets: ScopeTarget[]     = ['AUTH', 'USER', 'BUSINESS'];
  scopePermissions: ScopePermission[] = ['READ', 'WRITE'];

  constructor(
    private fb: FormBuilder,
    private service: ServiceAccountsService,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      validTo: [null],
      allowedIps: this.fb.array([]),
      scopes: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.load();
  }

  get allowedIps(): FormArray {
    return this.form.get('allowedIps') as FormArray;
  }
  get scopes(): FormArray {
    return this.form.get('scopes') as FormArray;
  }

  private load(): void {
    this.isLoading = true;
    this.service.list()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: all => {
          const acct = all.find(a => a.id === this.id)!;
          this.form.patchValue({
            name: acct.name,
            validTo: acct.validTo ? new Date(acct.validTo) : null,
          });
          acct.allowedIps.forEach(ip => this.allowedIps.push(this.fb.control(ip)));
          acct.scopes.forEach(s =>
            this.scopes.push(
              this.fb.group({
                target:     [s.target, Validators.required],
                permission: [s.permission, Validators.required],
              })
            )
          );
        },
        error: e => console.error(e)
      });
  }

  addIp(): void {
    this.allowedIps.push(this.fb.control('', Validators.required));
  }
  removeIp(i: number): void {
    this.allowedIps.removeAt(i);
  }

  addScope(): void {
    this.scopes.push(
      this.fb.group({
        target:     [null, Validators.required],
        permission: [null, Validators.required],
      })
    );
  }
  removeScope(i: number): void {
    this.scopes.removeAt(i);
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.isSubmitting = true;

    const raw = this.form.value;
    const dto: UpdateServiceAccountDto = {
      name: raw.name,
      validTo: raw.validTo ? raw.validTo.toISOString() : undefined,
      allowedIps: raw.allowedIps as string[],
      scopes: raw.scopes as CreateServiceAccountScopeDto[],
    };

    this.service.update(this.id, dto)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => this.updated.emit(),
        error: err => console.error(err),
      });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
