import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceAccountListComponent } from '../service-account-list/service-account-list.component';
import { ServiceAccountAddComponent  } from '../service-account-add/service-account-add.component';
import { ServiceAccountEditComponent } from '../service-account-edit/service-account-edit.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'custom-service-accounts-management',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ServiceAccountListComponent,
    ServiceAccountAddComponent,
    ServiceAccountEditComponent,
  ],
  templateUrl: './service-accounts-management.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ServiceAccountsManagementComponent {
  // “state machine” interne :
  activeTab: 'list' | 'add' | 'edit' = 'list';
  editId?: string;

  showList() { this.activeTab = 'list'; }
  showAdd()  { this.activeTab = 'add'; }
  showEdit(id: string) {
    this.editId = id;
    this.activeTab = 'edit';
  }

  onCreated() { this.showList(); }
  onUpdated() { this.showList(); }
}