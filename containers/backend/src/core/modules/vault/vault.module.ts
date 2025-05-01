import { Module, Global } from '@nestjs/common';
import { VaultService } from './services/vault.service';

/**
 * Module global dédié à la gestion des secrets via Vault.
 *
 * Ce module fournit le service VaultService, qui est responsable de l'initialisation,
 * de l'authentification et de la récupération des secrets depuis Vault, puis de la fusion
 * de ces secrets dans process.env afin que config service puisse les partager dans l'app pas la suite.
 * @category Core
 * @category Core Modules
 */
@Global()
@Module({
  providers: [VaultService],
  exports: [VaultService],
})
export class VaultModule {
  constructor() {
    console.log('VaultModule loaded');
  }
}
