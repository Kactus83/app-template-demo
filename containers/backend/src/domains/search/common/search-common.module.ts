import { Module } from '@nestjs/common';

@Module({
  providers: [
    // Services communs aux modules de recherche
  ],
  exports: [
    // Expose les services communs pour qu'ils puissent être injectés dans les autres modules
  ],
})
export class SearchCommonModule {}
