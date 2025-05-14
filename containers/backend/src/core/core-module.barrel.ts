/**
 * @module Core
 * @category Core
 * @include core-module.md
 *
 * Ce module constitue le socle fondamental de l'application backend.
 * Il regroupe les fonctionnalités essentielles telles que la configuration,
 * la gestion des logs, la connexion à la base de données, la sécurité,
 * la gestion des exceptions, etc.
 *
 * ## Contenu
 * - Filtres (exceptions)
 * - Guards (contrôles d'accès)
 * - Middlewares
 * - Modèles (DTO, interfaces, types, décorateurs)
 * - Modules (configuration, docs, santé, logger, vault)
 * - Repositories
 * - Services
 *
 * Pour plus de détails, consultez le fichier **core.module.md**.
 */

export * from './core.module';

// Filtres
export * from './filters/all-exceptions.filter';

// Guards
export * from './guards/auth.guard';

// Middlewares
export * from './middlewares/morgan.middleware';
export * from './middlewares/session.middleware';
export * from './middlewares/metadata.middleware';

// Modèles
// Décorateurs
export * from './models/decorators/roles.decorator';
export * from './models/decorators/token.decorator';
export * from './models/decorators/mfa.decorator';

// DTO
export * from './models/dto/jwt-payload.dto';
export * from './models/dto/jwt-mfa-payload.dto';
export * from './models/dto/jwt-service-account-payload.dto';
export * from './models/dto/client-metadata.dto';
export * from './models/dto/user.dto';

// Interfaces
export * from './models/interfaces/authenticated-request.interface';
export * from './models/interfaces/request-metadata.interface';
export * from './models/interfaces/tracked-request.interface';

// Types
export * from './models/types/auth-subject.enum';
export * from './models/types/userWithRelations.type';

// Modules
// Module de configuration
export * from './modules/config/app-config.module';
export * from './modules/config/services/config-loader.service';
export * from './modules/config/types/app.config';
export * from './modules/config/types/env.config';

// Module de documentation
export * from './modules/docs/docs.module';

// Module de santé
export * from './modules/health/health.controller';
export * from './modules/health/health.module';

// Module de logger
export * from './modules/logger/logger.module';
export * from './modules/logger/logger.service';

// Module Vault
export * from './modules/vault/vault.module';
export * from './modules/vault/services/vault.service';
export * from './modules/vault/types/vault-options.interface';
export * from './modules/vault/types/vault-secrets.class';

// Repositories
export * from './repositories/main-user.repository';

// Services
export * from './services/jwt-utility.service';
export * from './services/prisma.service';
