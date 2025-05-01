import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthenticationMethod } from '@prisma/client';
import { PhoneRepository } from '../repositories/phone.repository';
import { Twilio } from 'twilio';
import { MFAValidationData } from '../../MFA/models/dto/MFAValidationData';
import { AuthUserRepository } from '../../../../../domains/auth/common/repositories/auth-user.repository';
import { AuthMethodService } from '../../MFA/models/abstract/auth-method.service';
import { AuthMethodsService } from '../../../common/services/auth-methods.service';

@Injectable()
export class PhoneMFAService extends AuthMethodService {
  private readonly logger = new Logger(PhoneMFAService.name);
  private twilioClient: Twilio;

  constructor(
    private readonly phoneRepository: PhoneRepository,
    private readonly userRepository: AuthUserRepository,
    private readonly authMethodsService: AuthMethodsService,
    private readonly configService: ConfigService,
  ) {

    super(authMethodsService, AuthenticationMethod.PHONE);

    // utiliser config service pour les variables d'environnement
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.twilioClient = new Twilio(accountSid, authToken);
  }

  async requestMFA(userId: number): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Phone number not found');
    }

    // const userPhones = await this.phoneRepository.findByUserId(userId); ( a adapter )

    // Implémenter la logique pour envoyer les codes MFA via Twilio
    // Il faudra enviseager le cas ou plisuers phones sont associés à un seul utilisateur.
  }

  async validateMFA(userId: number, data: MFAValidationData): Promise<boolean> {
    // Implémenter la logique pour valider le code MFA
    // Conforme a celle de l'emission des codes.
    return false;
  }
}
