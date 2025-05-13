import { Injectable, Logger, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthUserRepository } from '../repositories/auth-user.repository';
import { AuthenticationMethod } from '@prisma/client';

/**
 * À l'initialisation de l'application, s'assure qu'un compte 'admin' existe.
 */
@Injectable()
export class AuthSeedService implements OnApplicationBootstrap, OnModuleInit {
  private readonly logger = new Logger(AuthSeedService.name);

  constructor(private readonly authUserRepo: AuthUserRepository) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('🚩 AuthSeed - onModuleInit() called');
  };

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('🚩 onApplicationBootstrap() called');
    const email = 'admin@application.com';
    const password = 'prodAdminPass';
    const existing = await this.authUserRepo.findByPrimaryOrSecondaryEmail(email);

    if (existing) {
      this.logger.log(`👤 Compte admin déjà existant (id=${existing.id}).`);
      return;
    }

    const hash = await bcrypt.hash(password, 10);
    const admin = await this.authUserRepo.create({
      email,
      password: hash,
      isEmailVerified: true,
      secondaryEmail: null,
      isSecondaryEmailVerified: false,
      username: 'admin',
      firstName: 'App',
      lastName: 'Admin',
      avatar: null,
      status: 'offline',
      roles: ['ADMIN'],
      authMethods: [AuthenticationMethod.CLASSIC],
    });

    await this.authUserRepo.addAuthMethod(admin.id, {
      method: AuthenticationMethod.CLASSIC,
      methodId: 1,
      order: 1,
    });

    this.logger.log(`✅ Nouveau compte admin seedé (id=${admin.id}).`);
  }
}
