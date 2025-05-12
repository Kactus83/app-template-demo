import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EmailLoginDto, UsernameLoginDto } from '../models/dto/login.dto';
import { AddEmailClassicAuthDto, AddUsernameClassicAuthDto } from '../models/dto/addClassicAuth.dto';
import { UserWithRelations } from '../../../../../core/models/types/userWithRelations.type';
import * as bcrypt from 'bcrypt';
import { EmailType, AuthenticationMethod } from '@prisma/client';
import { JwtUtilityService } from '../../../../../core/services/jwt-utility.service';
import { AuthUserRepository } from '../../../../../domains/auth/common/repositories/auth-user.repository';
import { EmailSenderService } from '../../../../../domains/auth/common/services/email-sender.service';
import { EmailVerificationTokenRepository } from 'src/domains/auth/common/repositories/email-verification-token.repository';
import { LoginResponseDto } from '../../../../../domains/auth/common/models/dto/login-response.dto';
import { UserDto } from '../../../../../core/models/dto/user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly jwtUtilityService: JwtUtilityService,
    private readonly emailService: EmailSenderService,
    private readonly emailVerificationTokenRepository: EmailVerificationTokenRepository,
  ) {}

  /**
   * Authentifie un utilisateur soit par email, soit par username.
   */
  async login(
    loginData: EmailLoginDto | UsernameLoginDto
  ): Promise<LoginResponseDto> {
    let user: UserWithRelations | null;

    // Recherche selon le type de login DTO
    if ('email' in loginData) {
      const email = loginData.email.trim().toLowerCase();
      user = await this.authUserRepository.findByPrimaryOrSecondaryEmail(email);
    } else {
      const username = loginData.username.trim();
      user = await this.authUserRepository.findByUsername(username);
    }

    if (!user || !user.password) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const valid = await bcrypt.compare(loginData.password, user.password);
    if (!valid) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const token = this.jwtUtilityService.signToken({
      userId: user.id,
      roles: user.roles,
    });

    const userDto = plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });

    return { user: userDto, token };
  }

  /**
   * Récupère l'utilisateur actuel.
   */
  async getCurrentUser(userId: number): Promise<UserWithRelations> {
    const user = await this.authUserRepository.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  /**
   * Rafraîchit le token si nécessaire, renvoie toujours un token valide.
   */
  async refreshTokenIfNeeded(
    userId: number,
    currentToken: string
  ): Promise<LoginResponseDto> {
    const user = await this.getCurrentUser(userId);

    let token = currentToken;
    if (this.jwtUtilityService.isTokenExpiringSoon(currentToken)) {
      token = this.jwtUtilityService.signToken({
        userId: user.id,
        roles: user.roles,
      });
    }

    const userDto = plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });

    return { user: userDto, token };
  }

  /**
   * Ajoute une authentification classique (email ou username) à un utilisateur existant.
   */
  async addClassicAuth(
    reqUser: UserWithRelations,
    addDto: AddEmailClassicAuthDto | AddUsernameClassicAuthDto
  ): Promise<UserDto> {
    if (reqUser.password) {
      throw new HttpException(
        'Classic authentication already configured',
        HttpStatus.BAD_REQUEST
      );
    }

    const hashed = await bcrypt.hash(addDto.password, 10);
    let updateData: any = { password: hashed };
    let needEmailVerification: EmailType | null = null;

    if ('email' in addDto) {
      const email = addDto.email.trim().toLowerCase();

      if (reqUser.email && reqUser.email === email) {
        if (!reqUser.isEmailVerified) needEmailVerification = EmailType.PRIMARY;
      } else if (reqUser.secondaryEmail && reqUser.secondaryEmail === email) {
        if (!reqUser.isSecondaryEmailVerified) needEmailVerification = EmailType.SECONDARY;
      } else if (!reqUser.secondaryEmail) {
        updateData.secondaryEmail = email;
        updateData.isSecondaryEmailVerified = false;
        needEmailVerification = EmailType.SECONDARY;
      } else {
        throw new HttpException(
          'Cannot add new email: already two emails set',
          HttpStatus.BAD_REQUEST
        );
      }
    } else {
      const username = addDto.username.trim();
      const exists = await this.authUserRepository.findByUsername(username);
      if (exists) {
        throw new HttpException('Username already in use', HttpStatus.BAD_REQUEST);
      }
      updateData.username = username;
    }

    // Mise à jour de l'utilisateur
    const updated = await this.authUserRepository.update(reqUser.id, updateData);
    if (!updated) {
      throw new HttpException(
        'Unable to update user',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // Ajout de la méthode CLASSIC
    await this.authUserRepository.addAuthMethod(reqUser.id, {
      method: AuthenticationMethod.CLASSIC,
      methodId: null,
      order: reqUser.userAuthMethods.length + 1,
    });

    // Envoi du mail de vérification si nécessaire
    if (needEmailVerification) {
      const tokenData = await this.emailVerificationTokenRepository.createToken(
        updated.id,
        needEmailVerification
      );
      await this.emailService.sendEmailVerification(
        `${updated.firstName ?? ''} ${updated.lastName ?? ''}`.trim() ||
          updated.username!,
        needEmailVerification === EmailType.PRIMARY
          ? updated.email!
          : updated.secondaryEmail!,
        tokenData.token,
        needEmailVerification
      );
    }

    return plainToInstance(UserDto, updated, {
      excludeExtraneousValues: true,
    });
  }
}