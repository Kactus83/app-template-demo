import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FuseCardComponent } from '@fuse/components/card';

@Component({
  selector: 'app-template-doc',
  standalone: true,
  imports: [FuseCardComponent],
  templateUrl: './app-template.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppTemplateComponent {
  /**
   * Documentation interactive du template :
   * - Pull & Structure (Docker + Terraform)
   * - Utilisation & Bonnes pratiques (Prisma, Core & Domaines, Frontend)
   * - Tech Stack synthétique
   * - Domaines exportés & services utiles
   */
}
