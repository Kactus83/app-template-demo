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
import {
  Template,
  TemplateGlobalStats,
} from 'app/core/app-templates/app-templates.types';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Composant d’aperçu de tous les templates CLI.
 * Affiche nom, description, stats et bouton de téléchargement.
 */
@Component({
  selector: 'templates-overview',
  templateUrl: './templates-overview.component.html',
  styleUrls: ['./templates-overview.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FuseCardComponent, MatButtonModule, MatIconModule],
})
export class TemplatesOverviewComponent {
  private readonly _svc = inject(AppTemplatesService);

  /** Liste des templates */
  templates$ = this._svc.getAllTemplates();

  /** Stats globales par template */
  stats$ = this._svc.getAllStats();

  /**
   * Combine templates et stats pour obtenir
   * un tableau { tpl, total }[]
   */
  templatesWithStats$ = combineLatest([this.templates$, this.stats$]).pipe(
    map(([tpls, stats]) =>
      tpls.map(tpl => ({
        tpl,
        total: stats.find(s => s.templateId === tpl.id)?.total ?? 0,
      }))
    )
  );

  /** Total de tous les téléchargements */
  totalDownloads$ = this.stats$.pipe(
    map(stats => stats.reduce((acc, s) => acc + s.total, 0))
  );

  download(template: Template): void {
    this._svc.downloadTemplate(template.id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
