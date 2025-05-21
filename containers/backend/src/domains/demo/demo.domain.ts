import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AppTemplatesModule } from './modules/app-templates/app-templates.module';
import { AppWizardModule } from './modules/app-wizard/app-wizard-module';

/**
 * @domain DemoDomain
 * Domaine de la démo CLI : gestion des templates embarqués.
 */
@Module({
  imports: [
    RouterModule.register([
      { path: 'app-templates', module: AppTemplatesModule },
      { path: 'wizard', module: AppWizardModule },
    ]),
    AppTemplatesModule,
    AppWizardModule,
  ],
})
export class DemoDomain {}
