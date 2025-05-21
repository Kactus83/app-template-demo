import { Injectable, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import { createReadStream, statSync } from 'fs';
import type { Readable } from 'stream';

/**
 * Logique métier pour la distribution du setup wizard.
 * @category Domains/Demo
 */
@Injectable()
export class AppWizardService {
  private readonly wizardDir = join(process.cwd(), 'public', 'wizard');
  private readonly fileName = 'setup-wizard-x64-light.zip';

  /**
   * Prépare le flux et les métadonnées du fichier ZIP du wizard.
   * @throws {NotFoundException} si le fichier n’existe pas.
   */
  getWizardFile(): { fileName: string; size: number; stream: Readable } {
    const fullPath = join(this.wizardDir, this.fileName);

    let size: number;
    try {
      size = statSync(fullPath).size;
    } catch {
      throw new NotFoundException(`Fichier wizard introuvable: ${this.fileName}`);
    }

    const stream = createReadStream(fullPath);
    return {
      fileName: this.fileName,
      size,
      stream,
    };
  }
}
