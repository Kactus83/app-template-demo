import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AppTemplatesModule } from './modules/app-templates/app-templates.module';

/**
 * @domain DemoDomain
 * Domaine de la démo CLI : gestion des templates embarqués.
 */
@Module({
  imports: [
    RouterModule.register([
      { path: 'demo', module: AppTemplatesModule },
    ]),
    AppTemplatesModule,
  ],
})
export class DemoDomain {}
