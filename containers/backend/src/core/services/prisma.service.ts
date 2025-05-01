import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Service pour la gestion de la connexion à la base de données Prisma.
 * @category Core
 * @category Core Services
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();
    console.log('PrismaService loaded');
  };

  async onModuleInit() {
    console.log('PrismaService initialized');
    try {
      await this.$connect();
      console.log('Connected to the database');
    } catch (error) {
      console.error('Failed to connect to the database', error.message);
      process.exit(1); 
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}