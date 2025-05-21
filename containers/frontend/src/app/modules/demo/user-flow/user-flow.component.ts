import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgForOf } from '@angular/common';

interface UserStep {
  label: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'user-flow',
  standalone: true,
  imports: [RouterLink, MatIconModule, NgForOf],
  templateUrl: './user-flow.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFlowComponent {
  /** Chaque cercle redirige vers le bon “module” (wizard / CLI / template) */
  steps: UserStep[] = [
    { label: 'Environnement basique', icon: 'heroicons_outline:server', link: '/demo/app-wizard' },
    { label: 'Installer le CLI',       icon: 'heroicons_outline:download', link: '/demo/app-wizard-cli' },
    { label: 'Authentifier le CLI',     icon: 'heroicons_outline:key',      link: '/demo/app-wizard-cli' },
    { label: 'Créer un projet',         icon: 'heroicons_outline:plus-circle', link: '/demo/app-wizard-cli' },
    { label: 'Intégration du template', icon: 'heroicons_outline:puzzle',   link: '/demo/app-template' },
    { label: 'Lancer en dev',           icon: 'heroicons_outline:desktop-computer', link: '/demo/app-wizard-cli' },
    { label: 'Déployer',                icon: 'heroicons_outline:cloud-upload',     link: '/demo/app-wizard-cli' }
  ];
}
