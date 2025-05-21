import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'wizard-step',
  template: `
    <h3 class="text-2xl font-semibold mb-4">Installation de l’environnement</h3>
    <p>
      Ce composant présente le <strong>Setup Wizard</strong> : diagnostics et correctifs en un clic
      (Node, npm, GitHub, Docker Desktop…).
    </p>
  `,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardStepComponent {}
