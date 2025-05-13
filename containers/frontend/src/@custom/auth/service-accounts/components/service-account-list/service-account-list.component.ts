import { Component, OnInit, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule }from '@angular/material/button';
import { MatIconModule }  from '@angular/material/icon';
import { finalize }       from 'rxjs';
import { fuseAnimations } from '@fuse/animations';

import { ServiceAccountsService } from '../../services/service-accounts.service';
import { ServiceAccountDto }      from '../../models/dto/service-accounts.dto';

@Component({
  selector: 'custom-service-account-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './service-account-list.component.html',
  styleUrls: ['./service-account-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ServiceAccountListComponent implements OnInit {
  @Output() edit = new EventEmitter<string>();
  @Output() add  = new EventEmitter<void>();

  displayedColumns = ['name','clientId','validTo','actions'];
  serviceAccounts: ServiceAccountDto[] = [];
  isLoading = false;

  constructor(private readonly service: ServiceAccountsService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.isLoading = true;
    this.service.list()
      .pipe(finalize(()=> this.isLoading = false))
      .subscribe({
        next: res => this.serviceAccounts = res,
        error: err => console.error(err),
      });
  }

  onAdd() {
    this.add.emit();
  }

  onEdit(id: string) {
    this.edit.emit(id);
  }

  onDelete(id: string) {
    if (!confirm('Really revoke this service account?')) return;
    this.service.revoke(id).subscribe({ next: ()=> this.loadAccounts(), error: e=> console.error(e) });
  }

  onRotate(id: string) {
    this.service.rotate(id).subscribe({
      next: res => alert(`New secret: ${res.clientSecret}`),
      error: err => console.error(err)
    });
  }
}