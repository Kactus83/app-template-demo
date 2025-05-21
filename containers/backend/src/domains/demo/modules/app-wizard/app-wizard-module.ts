import { Module } from '@nestjs/common';
import { AppWizardController } from './controllers/app-wizard.controller';
import { AppWizardService } from './services/app-wizard.service';

/**
 * Module pour exposer le endpoint de téléchargement du setup wizard.
 * @category Domains/Demo
 */
@Module({
  controllers: [AppWizardController],
  providers: [AppWizardService],
  exports: [AppWizardService],
})
export class AppWizardModule {}
