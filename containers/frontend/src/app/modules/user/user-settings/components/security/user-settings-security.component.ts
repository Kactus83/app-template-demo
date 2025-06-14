import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { PhoneManagementComponent } from '@custom/auth/phone/components/phone-management.component';
import { AuthenticatorManagementComponent } from '@custom/auth/authenticator/components/authenticator-management.component';
import { ServiceAccountsManagementComponent } from '@custom/auth/service-accounts/components/service-accounts-management/service-accounts-management.component';
import { UserSettingsEmailComponent } from '@custom/user/components/user-settings-email/user-settings-email.component';

interface Tab {
  key: 'email' | 'phone' | 'authenticator' | 'serviceAccounts';
  label: string;
  icon: string;
}

@Component({
  selector: 'user-settings-security',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    UserSettingsEmailComponent,
    PhoneManagementComponent,
    AuthenticatorManagementComponent,
    ServiceAccountsManagementComponent,
  ],
  templateUrl: './user-settings-security.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsSecurityComponent {
  /** Liste des onglets avec icônes */
  tabs: Tab[] = [
    { key: 'email', label: 'Email', icon: 'heroicons_outline:mail' },
    { key: 'phone', label: 'Phone', icon: 'heroicons_outline:phone' },
    { key: 'authenticator', label: 'Authenticator', icon: 'heroicons_outline:shield-check' },
    { key: 'serviceAccounts', label: 'Service Accounts', icon: 'heroicons_outline:user-group' },
  ];

  activeTab: Tab['key'] = 'email';

  setActiveTab(tab: Tab['key']): void {
    this.activeTab = tab;
  }
}
