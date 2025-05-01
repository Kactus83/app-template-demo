import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from '../models/dto/login.dto';
import { AddClassicAuthDto } from '../models/dto/addClassicAuth.dto';
import { UserWithRelations } from '../../../../../core/models/types/userWithRelations.type';
import * as bcrypt from 'bcrypt';
import { EmailType } from '@prisma/client';
import { JwtUtilityService } from '../../../../../core/services/jwt-utility.service';
import { AuthUserRepository } from '../../../../../domains/auth/common/repositories/auth-user.repository';
import { EmailSenderService } from '../../../../../domains/auth/common/services/email-sender.service';
import { LoginResponseDto } from '../../../../../domains/auth/common/models/dto/login-response.dto';
import { UserDto } from '../../../../../core/models/dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { EmailVerificationTokenRepository } from 'src/domains/auth/common/repositories/email-verification-token.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly jwtUtilityService: JwtUtilityService,
    private readonly emailService: EmailSenderService, 
    private readonly emailVerificationTokenRepository: EmailVerificationTokenRepository,
  ) {}

  async login(
    loginData: LoginDto
  ): Promise<LoginResponseDto> {
    const user = await this.authUserRepository.findByPrimaryOrSecondaryEmail(loginData.email);
    if (!user || !user.password || !user.email) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = this.jwtUtilityService.signToken({ userId: user.id, roles: user.roles });

    return { user, token };
  }

  async getCurrentUser(userId: number): Promise<UserWithRelations> {
    const user = await this.authUserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Récupère l'utilisateur et génère un token mis à jour si nécessaire.
   * @param userId ID de l'utilisateur.
   * @param currentToken Token actuel de l'utilisateur.
   * @returns LoginResponseDto contenant l'utilisateur et le token (mis à jour si nécessaire).
   */
  async refreshTokenIfNeeded(userId: number, currentToken: string): Promise<LoginResponseDto> {
    // Récupérer l'utilisateur actuel
    const user = await this.getCurrentUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Vérifier si le token approche de son expiration et en générer un nouveau si nécessaire
    let token = currentToken;
    if (this.jwtUtilityService.isTokenExpiringSoon(currentToken)) {
      token = this.jwtUtilityService.signToken({ userId: user.id, roles: user.roles });
    }

    // Nettoyer l'objet utilisateur pour respecter le DTO
    const userDto = plainToInstance(UserDto, user, { excludeExtraneousValues: true });

    return { user: userDto, token };
  }


  /**
   * Ajoute l'authentification classique pour un utilisateur déjà authentifié via OAuth/Web3.
   *
   * La logique est la suivante :
   * 1. Si l'utilisateur a déjà un mot de passe, on rejette.
   * 2. Si l'utilisateur possède déjà deux emails différents et que l'email fourni n'est ni le primaire ni le secondaire, on rejette.
   * 3. Si l'email fourni correspond à l'email primaire :
   *    - S'il est vérifié, on met à jour le mot de passe.
   *    - Sinon, on met à jour le mot de passe et on déclenche la vérification du mail primaire.
   * 4. Sinon, si l'email fourni correspond à l'email secondaire :
   *    - Même logique que pour le primaire.
   * 5. Sinon, si l'utilisateur a un email primaire différent et pas de secondaire, on ajoute l'email fourni comme secondaire et on déclenche la vérification.
   * 6. Si aucun email primaire n'est défini, on définit l'email fourni comme primaire et on déclenche la vérification.
   *
   * L'utilisateur est déjà présent dans la requête (via le guard) sous forme de UserDto,
   * ainsi on évite une recherche supplémentaire.
   *
   * @param reqUser L'utilisateur (UserDto) déjà injecté dans la requête.
   * @param addClassicAuthDto Le DTO contenant l'email et le mot de passe.
   * @returns Le UserDto mis à jour (épuré via class-transformer).
   * @throws HttpException en cas de conditions non satisfaites.
   */
  async addClassicAuth(
    reqUser: UserWithRelations,
    addClassicAuthDto: AddClassicAuthDto
  ): Promise<UserDto> {
    // 1. Si l'utilisateur a déjà un mot de passe, on refuse.
    if (reqUser.password) {
      throw new HttpException('Classic authentication already exists for this user', HttpStatus.BAD_REQUEST);
    }

    // Normaliser l'email fourni
    const providedEmail = addClassicAuthDto.email.trim().toLowerCase();
    let updateData: Partial<any> = {};
    let emailForVerification: EmailType | null = null;
    const hashedPassword = await bcrypt.hash(addClassicAuthDto.password, 10);

    if (reqUser.email) {
      const primaryEmail = reqUser.email.trim().toLowerCase();
      if (primaryEmail === providedEmail) {
        // Cas : l'email fourni correspond au primaire
        updateData.password = hashedPassword;
        emailForVerification = reqUser.isEmailVerified ? null : EmailType.PRIMARY;
      } else {
        // L'email fourni ne correspond pas au primaire
        if (reqUser.secondaryEmail) {
          const secondaryEmail = reqUser.secondaryEmail.trim().toLowerCase();
          if (secondaryEmail === providedEmail) {
            // Cas : l'email fourni correspond au secondaire
            updateData.password = hashedPassword;
            emailForVerification = reqUser.isSecondaryEmailVerified ? null : EmailType.SECONDARY;
          } else {
            // L'utilisateur a déjà deux emails différents qui ne correspondent pas
            throw new HttpException('User already has two different emails. Cannot add a new one.', HttpStatus.BAD_REQUEST);
          }
        } else {
          // Aucun secondaire existant : on ajoute providedEmail comme secondaire
          updateData = {
            password: hashedPassword,
            secondaryEmail: providedEmail,
            isSecondaryEmailVerified: false,
          };
          emailForVerification = EmailType.SECONDARY;
        }
      }
    } else {
      // Aucun email primaire défini : on utilise providedEmail comme primaire
      updateData = {
        password: hashedPassword,
        email: providedEmail,
        isEmailVerified: false,
      };
      emailForVerification = EmailType.PRIMARY;
    }

    // Mise à jour de l'utilisateur dans la base
    const updatedUser = await this.authUserRepository.update(reqUser.id, updateData);
    if (!updatedUser) {
      throw new HttpException('Unable to update user', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Déclencher la vérification si nécessaire
    if (emailForVerification) {
      const tokenData = await this.emailVerificationTokenRepository.createToken(updatedUser.id, emailForVerification);
      await this.emailService.sendEmailVerification(
        updatedUser.name,
        emailForVerification === EmailType.PRIMARY ? updatedUser.email : updatedUser.secondaryEmail,
        tokenData.token,
        emailForVerification
      );
    }

    // Nettoyer l'objet utilisateur pour respecter le DTO
    const userDto = plainToInstance(UserDto, updatedUser, { excludeExtraneousValues: true });
    return userDto;
  }
}
