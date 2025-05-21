import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'cli-step',
  template: `
    <h3 class="text-2xl font-semibold mb-4">Présentation du CLI</h3>
    <p>
      Ce composant présente le <strong>app-wizard-cli</strong> :
      installation, authentication, création de projet, dev-run et deploy.
    </p>
  `,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CliStepComponent {}
