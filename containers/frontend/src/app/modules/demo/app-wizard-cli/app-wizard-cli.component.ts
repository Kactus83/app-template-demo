import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { NgForOf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface Command {
  cmd: string;
  desc: string;
  icon: string;
}

@Component({
  selector: 'app-wizard-cli',
  standalone: true,
  imports: [NgForOf, MatIconModule],
  templateUrl: './app-wizard-cli.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppWizardCliComponent {

  /** Liste complète des commandes */
  commands: Command[] = [
    { cmd: 'npm install -g app-wizard-cli', desc: 'Installation globale du CLI',             icon: 'heroicons_outline:download' },
    { cmd: 'appwizard credentials',          desc: 'Génération de la clé service via login',   icon: 'heroicons_outline:key'      },
    { cmd: 'appwizard create <nom>',         desc: 'Création d’un projet (nom ou dossier courant)', icon: 'heroicons_outline:plus-circle' },
    { cmd: 'appwizard dev-run',              desc: 'Lancement de la stack Docker en mode dev', icon: 'heroicons_outline:desktop-computer' },
    { cmd: 'appwizard deploy',               desc: 'Provision infra & déploiement prod',        icon: 'heroicons_outline:cloud-upload' },
    { cmd: 'appwizard config',               desc: 'Configuration CLI (provider, région, options)', icon: 'heroicons_outline:cog'      },
    { cmd: 'appwizard monitor',              desc: 'Supervision des conteneurs Docker',         icon: 'heroicons_outline:chart-square-bar' },
    { cmd: 'appwizard build',                desc: 'Construction des images Docker',            icon: 'heroicons_outline:archive'  },
    { cmd: 'appwizard clean',                desc: 'Nettoyage (images, volumes, réseaux)',      icon: 'heroicons_outline:trash'    },
    { cmd: 'appwizard doctor',               desc: 'Vérification des prérequis (Node, Docker, Git)', icon: 'heroicons_outline:stethoscope' },
    { cmd: 'appwizard template',             desc: 'Infos & listing des services du template',   icon: 'heroicons_outline:template' },
    { cmd: 'appwizard helpers',              desc: 'Outils d’assistance & réparation',          icon: 'heroicons_outline:wrench'   }
  ];

  /** Séparez les commandes par section */
  installCommands = this.commands.slice(0, 2);
  createCommands  = this.commands.slice(2, 5);
  otherCommands   = this.commands.slice(5);
}
