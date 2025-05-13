import { CommonModule, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule }   from '@angular/material/icon';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService }      from '@fuse/services/media-watcher';
import { Subject, takeUntil }           from 'rxjs';

import { UserSettingsProfileComponent }  from './components/profile/user-settings-profile.component';
import { UserSettingsSecurityComponent } from './components/security/user-settings-security.component';

@Component({
  selector: 'user-settings',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    NgClass,
    UserSettingsProfileComponent,
    UserSettingsSecurityComponent,
    CommonModule
  ],
  templateUrl: './user-settings.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer!: MatDrawer;
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened = true;
  panels!: { id: string; icon: string; title: string; description: string }[];
  selectedPanel = 'profile';

  private _unsubscribeAll = new Subject<void>();

  constructor(
    private _cdr: ChangeDetectorRef,
    private _mediaWatcher: FuseMediaWatcherService
  ) {}

  ngOnInit(): void {
    this.panels = [
      {
        id: 'profile',
        icon: 'heroicons_outline:user-circle',
        title: 'Profile',
        description: 'View and edit your profile',
      },
      {
        id: 'security',
        icon: 'heroicons_outline:lock-closed',
        title: 'Security',
        description: 'Manage security settings',
      },
    ];

    this._mediaWatcher.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        if (matchingAliases.includes('lg')) {
          this.drawerMode = 'side';
          this.drawerOpened = true;
        } else {
          this.drawerMode = 'over';
          this.drawerOpened = false;
        }
        this._cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  goToPanel(panel: string): void {
    this.selectedPanel = panel;
    if (this.drawerMode === 'over') {
      this.drawer.close();
    }
  }

  getPanelInfo(id: string) {
    return this.panels.find((p) => p.id === id)!;
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}