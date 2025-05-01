/**
 * @file Test End-to-End pour l'application NestJS
 * @description Vérifie le bon fonctionnement de l'API principale.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { beforeAll, afterAll, it } from '@jest/globals';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  /**
   * Vérifie que la requête GET / renvoie bien une erreur 404
   */
  it('should return 404 for unknown route', () => {
    return request(app.getHttpServer()).get('/').expect(404);
  });

  /**
   * Vérifie que la route de santé est fonctionnelle
   */
  it('should return 200 for health check', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'OK' });
  });
});
