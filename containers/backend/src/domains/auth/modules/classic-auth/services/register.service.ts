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

  /**
   * Enregistre un nouvel utilisateur et initie la vérification email
   * ainsi que la notification de bienvenue.
   *
   * @param registerData Données d'inscription (email, mot de passe, pseudo, prénom, nom, email secondaire)
   * @returns L'utilisateur complet avec toutes ses relations.
   * @throws Error si email, secondaryEmail ou pseudo déjà utilisés.
   */
  async register(registerData: RegisterDto): Promise<UserWithRelations> {
    const {
      email,
      password,
      secondaryEmail,
      username,
      firstName,
      lastName,
    } = registerData;

    // Verifier que l'email ou le pseudo et le mot de passe sont fournis
    if((!email && !username) || !password) {
      throw new Error('Email or username AND password is required');
    }

    // 1️⃣ Vérifier unicité de l'email principal
    const existingUser = await this.authUserRepository.findByPrimaryOrSecondaryEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // 2️⃣ Vérifier unicité de l'email secondaire
    if (secondaryEmail) {
      const existingSecondary = await this.authUserRepository.findByPrimaryOrSecondaryEmail(secondaryEmail);
      if (existingSecondary) {
        throw new Error('Secondary email already in use');
      }
    }

    // 3️⃣ Vérifier unicité du pseudo
    if (username) {
      const existingUsername = await this.authUserRepository.findByUsername(username);
      if (existingUsername) {
        throw new Error('Username already in use');
      }
    }

    // 4️⃣ Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Créer l'utilisateur
    let user = await this.authUserRepository.create({
      email,
      username: username ?? null,
      firstName: firstName ?? null,
      lastName: lastName ?? null,
      isEmailVerified: false,
      secondaryEmail: secondaryEmail ?? null,
      isSecondaryEmailVerified: false,
      password: hashedPassword,
      avatar: null,
      status: 'offline',
      roles: ['USER'],
      authMethods: [AuthenticationMethod.CLASSIC],
    });

    // 6️⃣ Ajouter la méthode CLASSIC dans userAuthMethods
    await this.authUserRepository.addAuthMethod(user.id, {
      method: AuthenticationMethod.CLASSIC,
      methodId: null,
      order: 1,
    });

    // 7️⃣ Fallback prénom si ni prénom ni nom fournis
    if (!user.firstName && !user.lastName) {
      const defaultFirstName = `User-${user.id}`;
      user = await this.authUserRepository.update(user.id, {
        firstName: defaultFirstName,
      });
    }

    // Préparer le nom complet pour les emails/notifications
    const displayName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username!;

    // 8️⃣ Générer et envoyer le token de vérification principal
    const primaryToken = await this.emailVerificationTokenRepository.createToken(user.id, 'PRIMARY');
    await this.emailService.sendEmailVerification(
      displayName,
      user.email!,
      primaryToken.token,
      'PRIMARY',
    );

    // 9️⃣ Token de vérification secondaire si nécessaire
    if (user.secondaryEmail) {
      const secondaryToken = await this.emailVerificationTokenRepository.createToken(user.id, 'SECONDARY');
      await this.emailService.sendEmailVerification(
        displayName,
        user.secondaryEmail,
        secondaryToken.token,
        'SECONDARY',
      );
    }

    // 🔟 Notification de bienvenue
    await this.notificationService.createNotification(user.id, {
      title: 'Welcome!',
      description: `Hello ${displayName}, welcome to our platform!`,
      time: new Date(),
      read: false,
    });

    return user;
  }
}
