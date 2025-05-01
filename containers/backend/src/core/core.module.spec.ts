/**
 * @file Test Unitaire - CoreModule
 * @description Vérifie l'importation et l'initialisation du CoreModule.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { CoreModule } from './core.module';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('CoreModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile();
  });

  /**
   * Vérifie que le module est bien instancié
   */
  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
