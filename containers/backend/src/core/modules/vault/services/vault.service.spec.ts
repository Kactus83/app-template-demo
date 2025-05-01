/**
 * @file Test Unitaire - VaultService
 * @description Vérifie uniquement l'existence du service sans dépendre de Vault.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { VaultService } from './vault.service';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('VaultService', () => {
  let service: VaultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VaultService],
    }).compile();

    service = module.get<VaultService>(VaultService);
  });

  /**
   * Vérifie que le service est bien instancié
   */
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
