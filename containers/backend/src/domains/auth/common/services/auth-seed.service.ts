import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthUserRepository } from '../repositories/auth-user.repository';
import { AuthenticationMethod } from '@prisma/client';

/**
 * À l'initialisation de l'application, s'assure qu'un compte 'admin' existe.
 */
@Injectable()
export class AuthSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AuthSeedService.name);

  constructor(private readonly authUserRepo: AuthUserRepository) {}

  async onApplicationBootstrap(): Promise<void> {
    const email = 'admin@admin.fr';
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
      username: 'Admin',
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
