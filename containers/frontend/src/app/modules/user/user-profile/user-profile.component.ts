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
import { MatButtonModule }    from '@angular/material/button';
import { MatIconModule }      from '@angular/material/icon';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService }      from '@fuse/services/media-watcher';
import { Subject }            from 'rxjs';
import { takeUntil }          from 'rxjs/operators';

import { UserSettingsProfileComponent }     from '@custom/user/components/user-settings-profile/user-settings-profile.component';
import { UserSettingsSocialComponent }      from '@custom/user/components/user-settings-social/user-settings-social.component';
import { UserSettingsPreferencesComponent } from '@custom/user/components/user-settings-preferences/user-settings-preferences.component';

@Component({
  selector: 'user-profile',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    UserSettingsProfileComponent,
    UserSettingsSocialComponent,
    UserSettingsPreferencesComponent,
  ],
  templateUrl: './user-profile.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer!: MatDrawer;

  drawerMode: 'over' | 'side' = 'side';
  drawerOpened = true;

  panels = [
    {
      id: 'profile',
      icon: 'heroicons_outline:user-circle',
      title: 'Profil',
      description: 'Informations publiques',
    },
    {
      id: 'social',
      icon: 'heroicons_outline:share',
      title: 'Réseaux sociaux',
      description: 'Biographie et liens',
    },
    {
      id: 'preferences',
      icon: 'heroicons_outline:cog-6-tooth',
      title: 'Préférences',
      description: 'Langue, thème, fuseau…',
    },
  ];
  selectedPanel = 'profile';

  private _unsubscribeAll = new Subject<void>();

  constructor(
    private _cdr: ChangeDetectorRef,
    private _mediaWatcher: FuseMediaWatcherService
  ) {}

  ngOnInit(): void {
    // Adaptation responsive du drawer
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

  goToPanel(panelId: string): void {
    this.selectedPanel = panelId;
    if (this.drawerMode === 'over') {
      this.drawer.close();
    }
  }

  getPanelInfo(id: string) {
    return this.panels.find(p => p.id === id)!;
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
