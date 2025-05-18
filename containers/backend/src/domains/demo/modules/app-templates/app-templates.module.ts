import { Module } from '@nestjs/common';
import { AppTemplatesController } from './controllers/app-templates.controller';
import { AppTemplatesService } from './services/app-templates.service';
import { TemplateRepository } from './repositories/template.repository';

/**
 * Module pour exposer les endpoints de listing,
 * téléchargement et statistiques des templates CLI.
 * @category Domains/Demo
 */
@Module({
  controllers: [AppTemplatesController],
  providers: [TemplateRepository, AppTemplatesService],
  exports: [AppTemplatesService],
})
export class AppTemplatesModule {}
