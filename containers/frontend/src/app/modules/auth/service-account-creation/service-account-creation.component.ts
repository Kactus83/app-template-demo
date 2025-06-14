import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
})
export class AuthServiceAccountCreationComponent implements OnInit {
  @ViewChild('saCreate', { static: true })
  private saCreateComp!: ServiceAccountCreateComponent;

  saDto!: CreateServiceAccountDto;
  isCreating = false;
  creds: CreateServiceAccountResponseDto | null = null;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
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

    const scopesParam = qp.get('scopes') || 'USER:READ';
    const scopes: CreateServiceAccountScopeDto[] = scopesParam.split(',').map(
      (pair) => {
        const [targetRaw, permissionRaw] = pair.split(':');
        return {
          target: targetRaw as ScopeTarget,
          permission: permissionRaw as ScopePermission,
        };
      }
    );

    this.saDto = { name, validTo, allowedIps, scopes };
  }

  onCreate(): void {
    this.showAlert = false;
    this.isCreating = true;
    this.saCreateComp.create();
  }

  onCreated(creds: CreateServiceAccountResponseDto): void {
    this.isCreating = false;
    this.creds = creds;
    this.alert = {
      type: 'success',
      message: 'Service Account créé avec succès !',
    };
    this.showAlert = true;
  }

  onError(error: any): void {
    console.error('Erreur création Service Account', error);
    this.isCreating = false;
    this.alert = {
      type: 'error',
      message: 'Échec de la création. Veuillez réessayer.',
    };
    this.showAlert = true;
  }

  onDownload(): void {
    if (!this.creds) {
      return;
    }
    const payload = {
      clientId: this.creds.clientId,
      clientSecret: this.creds.secret,
      scopes: this.creds.scopes.map((s) => `${s.target}:${s.permission}`),
      validTo: this.creds.validTo,
      allowedIps: this.creds.allowedIps,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sa-credentials-${this.creds.clientId}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
