import { Component, inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppWizardService } from 'app/core/app-wizard/app-wizard.service';

@Component({
  selector: 'app-wizard',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './app-wizard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppWizardComponent {
  private wizardService = inject(AppWizardService);
  downloading = false;

  /**
   * Démarre le téléchargement du wizard et force la sauvegarde locale.
   */
  download(): void {
    this.downloading = true;
    this.wizardService.downloadWizard().subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'setup-wizard-x64-light.zip';
        link.click();
        window.URL.revokeObjectURL(url);
        this.downloading = false;
      },
      error: () => {
        // Vous pouvez afficher une notification d’erreur ici si souhaité
        this.downloading = false;
      }
    });
  }
}
