import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'template-step',
  template: `
    <h3 class="text-2xl font-semibold mb-4">Utilisation du App Template</h3>
    <p>
      Ce composant explique comment intégrer et configurer correctement le
      <strong>App Template</strong> (structure Angular + NestJS, dev stack Docker,…).
    </p>
  `,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateStepComponent {}
