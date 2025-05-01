import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

/**
 * Module dédié à la documentation TypeDoc.
 *
 * Il utilise ServeStaticModule pour exposer tout le contenu du dossier
 * `deployments/docs` (index.html, CSS, JS, etc.) sur la route `/docs`.
 * @category Core
 * @category Core Modules
 */
@Module({
  imports: [
    ServeStaticModule.forRoot({
      // Chemin absolu dans l'image où se trouve la doc
      rootPath: join(process.cwd(), 'deployments', 'backend', 'docs'),
      // Chemin d'accès HTTP => http://localhost:3000/docs
      serveRoot: '/docs',
    }),
  ],
})
export class DocsModule {
  constructor() {
    console.log('DocsModule loaded (static serving of TypeDoc).');
  }
}
