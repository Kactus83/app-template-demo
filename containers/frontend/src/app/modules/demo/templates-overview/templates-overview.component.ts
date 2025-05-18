import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseCardComponent } from '@fuse/components/card';
import { AppTemplatesService } from 'app/core/app-templates/app-templates.service';
import { Template } from 'app/core/app-templates/app-templates.types';
import { Observable } from 'rxjs';

/**
 * Composant d’aperçu de tous les templates CLI.
 * Affiche nom, description et bouton de téléchargement.
 */
@Component({
  selector: 'templates-overview',
  templateUrl: './templates-overview.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FuseCardComponent,
    MatButtonModule,
    MatIconModule,
  ],
})
export class TemplatesOverviewComponent {
  private readonly _service = inject(AppTemplatesService);

  /** Flux de tous les templates */
  templates$: Observable<Template[]> = this._service.getAllTemplates();

  /**
   * Télécharge un template en créant un lien
   * et en déclenchant le téléchargement.
   */
  download(template: Template): void {
    this._service.downloadTemplate(template.id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
