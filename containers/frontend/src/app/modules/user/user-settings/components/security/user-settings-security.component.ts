import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserEmailSettingsComponent }               from '@custom/user/components/email/user-email-settings.component';
import { PhoneManagementComponent }                 from '@custom/auth/phone/components/phone-management.component';
import { AuthenticatorManagementComponent }         from '@custom/auth/authenticator/components/authenticator-management.component';
import { ServiceAccountsManagementComponent }       from '@custom/auth/service-accounts/components/service-accounts-management/service-accounts-management.component';

@Component({
  selector: 'user-settings-security',
  standalone: true,
  imports: [
    CommonModule,
    UserEmailSettingsComponent,
    PhoneManagementComponent,
    AuthenticatorManagementComponent,
    ServiceAccountsManagementComponent,
  ],
  templateUrl: './user-settings-security.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsSecurityComponent {
  activeTab: 'email' | 'phone' | 'authenticator' | 'serviceAccounts' = 'email';

  setActiveTab(tab: 'email' | 'phone' | 'authenticator' | 'serviceAccounts'): void {
    this.activeTab = tab;
  }
}