import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { RegisterDto } from '../models/dto/register.dto';
import { UserWithRelations } from '../../../../../core/models/types/userWithRelations.type';
import * as bcrypt from 'bcrypt';
import { AuthenticationMethod } from '@prisma/client';
import { CommunicationService } from '../../../../../domains/communication/communication.service';
import { AuthUserRepository } from '../../../../../domains/auth/common/repositories/auth-user.repository';
import { EmailSenderService } from '../../../../../domains/auth/common/services/email-sender.service';
import { EmailVerificationTokenRepository } from 'src/domains/auth/common/repositories/email-verification-token.repository';

@Injectable()
export class RegisterService {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly emailVerificationTokenRepository: EmailVerificationTokenRepository,
    private readonly emailService: EmailSenderService, 
    @Inject(forwardRef(() => CommunicationService))
    private readonly notificationService: CommunicationService,
  ) {}

  async register(registerData: RegisterDto): Promise<UserWithRelations> {
    const existingUser = await this.authUserRepository.findByPrimaryOrSecondaryEmail(registerData.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    if (registerData.secondaryEmail) {
      const existingSecondaryEmailUser = await this.authUserRepository.findByPrimaryOrSecondaryEmail(registerData.secondaryEmail);
      if (existingSecondaryEmailUser) {
        throw new Error('Secondary email already in use');
      }
    }

    const hashedPassword = await bcrypt.hash(registerData.password, 10);

    let user = await this.authUserRepository.create({
      email: registerData.email,
      isEmailVerified: false,
      secondaryEmail: registerData.secondaryEmail || null,
      isSecondaryEmailVerified: false,
      password: hashedPassword,
      name: registerData.name ?? null,
      avatar: null,
      status: 'offline',
      roles: ['USER'],
      authMethods: [AuthenticationMethod.CLASSIC],
    });

    // Ajout de la première méthode d'authentification dans userAuthMethods
    await this.authUserRepository.addAuthMethod(user.id, {
      method: AuthenticationMethod.CLASSIC,
      methodId: 1, // Peut être ajusté selon l'ID principal si nécessaire
      order: 1,
    });

    // Set default name if not provided
    if (!user.name) {
      const defaultName = `User-${user.id}`;
      user = await this.authUserRepository.update(user.id, { name: defaultName });
    }

    // Generate and send email verification tokens
    const primaryToken = await this.emailVerificationTokenRepository.createToken(user.id, 'PRIMARY');
    await this.emailService.sendEmailVerification(user.name, user.email, primaryToken.token, 'PRIMARY');

    if (user.secondaryEmail) {
      const secondaryToken = await this.emailVerificationTokenRepository.createToken(user.id, 'SECONDARY');
      await this.emailService.sendEmailVerification(user.name, user.secondaryEmail, secondaryToken.token, 'SECONDARY');
    }

    // Send welcome notification
    await this.notificationService.createNotification(user.id, {
      title: 'Welcome!',
      description: `Hello ${user.name}, welcome to our platform!`,
      time: new Date(),
      read: false,
    });

    return user;
  }
}
