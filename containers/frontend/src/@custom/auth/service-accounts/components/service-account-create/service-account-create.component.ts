import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import {
  CreateServiceAccountDto,
  CreateServiceAccountResponseDto,
} from '../../models/dto/service-accounts.dto';
import { ServiceAccountsService } from '../../services/service-accounts.service';

@Component({
  selector: 'custom-service-account-create',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-account-create.component.html',
  styleUrls: ['./service-account-create.component.scss'],
})
export class ServiceAccountCreateComponent {
  /** DTO qu’on fournit depuis la page parente */
  @Input() dto!: CreateServiceAccountDto;
  /** Évènement émis en cas de succès, avec le DTO complet + secret */
  @Output() created = new EventEmitter<CreateServiceAccountResponseDto>();

  isLoading = false;
  error: string | null = null;

  constructor(private saService: ServiceAccountsService) {}

  /** À appeler (par le parent) pour déclencher la création */
  create(): void {
    if (!this.dto) {
      this.error = 'Données de création manquantes.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.saService
      .create(this.dto)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (resp) => this.created.emit(resp),
        error: (err) =>
          (this.error =
            err.error?.message || 'Erreur lors de la création du Service Account'),
      });
  }
}
