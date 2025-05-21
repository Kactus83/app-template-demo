import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import {
  CreateServiceAccountDto,
  CreateServiceAccountResponseDto,
  CreateServiceAccountScopeDto,
  ScopeTarget,
  ScopePermission,
} from '@custom/auth/service-accounts/models/dto/service-accounts.dto';
import { ServiceAccountCreateComponent } from '@custom/auth/service-accounts/components/service-account-create/service-account-create.component';

@Component({
  selector: 'auth-sa-cli-create',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    FuseAlertComponent,
    ServiceAccountCreateComponent,
  ],
  templateUrl: './service-account-creation.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AuthServiceAccountCreationComponent implements OnInit {
  /** DTO fourni par le CLI via queryParams */
  saDto!: CreateServiceAccountDto;

  @ViewChild(ServiceAccountCreateComponent)
  private saCreateComp!: ServiceAccountCreateComponent;

  /** Alert pour erreurs éventuelles */
  alert: { type: FuseAlertType; message: string } = {
    type: 'error',
    message: '',
  };
  showAlert = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap;
    const name = qp.get('name') || 'CLI principal';
    const validTo = qp.get('validTo') || undefined;
    const allowedIps = qp.get('allowedIps')
      ? qp.get('allowedIps')!.split(',')
      : [];

    // Transformation de la chaîne "TARGET:PERM,OTHER:PERM" en scope DTO
    const scopesParam = qp.get('scopes') || 'USER:READ';
    const scopes: CreateServiceAccountScopeDto[] = scopesParam
      .split(',')
      .map(pair => {
        const [targetRaw, permissionRaw] = pair.split(':');
        const target = targetRaw as ScopeTarget;
        const permission = permissionRaw as ScopePermission;
        return { target, permission };
      });

    this.saDto = { name, validTo, allowedIps, scopes };
  }

  /** Déclenche la création du Service Account via le composant enfant */
  onCreate(): void {
    this.showAlert = false;
    this.saCreateComp.create();
  }

  /**
   * Lorsque la création réussit, on génère et télécharge
   * automatiquement le JSON contenant clientId & secret.
   */
  onCreated(creds: CreateServiceAccountResponseDto): void {
    const payload = {
      clientId: creds.clientId,
      clientSecret: creds.secret,
      scopes: creds.scopes.map(s => `${s.target}:${s.permission}`),
      validTo: creds.validTo,
      allowedIps: creds.allowedIps,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sa-credentials-${creds.clientId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
