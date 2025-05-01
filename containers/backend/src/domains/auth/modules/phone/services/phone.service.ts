import { Injectable, Logger } from '@nestjs/common';
import { AddPhoneDto } from '../models/dto/add-phone.dto';
import { VerifyPhoneDto } from '../models/dto/verify-phone.dto';
import { UpdatePhoneDto } from '../models/dto/update-phone.dto';
import { Phone , AuthenticationMethod } from '@prisma/client';

import { PhoneRepository } from '../repositories/phone.repository';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { CommunicationService } from '../../../../../domains/communication/communication.service';
import { AuthUserRepository } from '../../../../../domains/auth/common/repositories/auth-user.repository';

@Injectable()
export class PhoneService {
  private twilioClient: Twilio;
  private verifyServiceSid: string;
  private readonly logger = new Logger(PhoneService.name);

  constructor(
    private readonly phoneRepository: PhoneRepository,
    private readonly userRepository: AuthUserRepository,
    private readonly configService: ConfigService,
    private readonly communicationService: CommunicationService,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.verifyServiceSid = this.configService.get<string>('TWILIO_VERIFY_SERVICE_SID');

    if (!accountSid || !authToken || !this.verifyServiceSid) {
      this.logger.error('Twilio environment variables are not set in ConfigService');
      throw new Error('Twilio environment variables are not set');
    }

    this.twilioClient = new Twilio(accountSid, authToken);
  }

  /**
   * Ajoute un nouveau numéro de téléphone pour un utilisateur.
   * @param userId ID de l'utilisateur.
   * @param addPhoneDto DTO contenant le numéro de téléphone à ajouter.
   * @returns Le numéro de téléphone ajouté.
   */
  async addPhone(userId: number, addPhoneDto: AddPhoneDto): Promise<Phone> {
    const phone = await this.phoneRepository.addPhone(userId, addPhoneDto.phoneNumber);

    this.logger.log(`Création du numéro de téléphone ${phone.phoneNumber} pour l'utilisateur ${userId}`);

    // Envoyer le SMS de vérification via Twilio Verify
    await this.sendVerificationSMS(phone.phoneNumber);

    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      this.logger.error(`User not found with ID: ${userId}`);
      throw new Error('User not found');
    }

    if (existingUser.authMethods.includes(AuthenticationMethod.PHONE)) {
      this.logger.warn(`Phone already added for user ID: ${userId}`);
      throw new Error('Phone already added');
    }

    await this.userRepository.update(userId, { authMethods: [...existingUser.authMethods, AuthenticationMethod.PHONE] });

    // Envoi d'une notification via le domaine de communication
    await this.communicationService.createNotification(userId, {
      title: 'Phone Verification',
      description: 'You have successfully registered your phone number. Please verify it',
      time: new Date(),
      read: false,
    });

    return phone;
  }

  /**
   * Vérifie un numéro de téléphone en validant le token via Twilio Verify.
   * @param verifyPhoneDto DTO contenant le token de vérification et le numéro de téléphone.
   * @returns Le numéro de téléphone vérifié.
   */
  async verifyPhone(verifyPhoneDto: VerifyPhoneDto): Promise<Phone> {
    try {
      // Utiliser Twilio Verify pour vérifier le code
      const verificationCheck = await this.twilioClient.verify.v2.services(this.verifyServiceSid)
        .verificationChecks
        .create({ to: verifyPhoneDto.phoneNumber, code: verifyPhoneDto.token });

      if (verificationCheck.status !== 'approved') {
        this.logger.error(`Échec de la vérification du numéro de téléphone ${verifyPhoneDto.phoneNumber}: ${verificationCheck.status}`);
        throw new Error('Token de vérification invalide ou expiré');
      }

      // Mettre à jour le statut du téléphone en vérifié
      const phone = await this.phoneRepository.verifyPhoneByNumber(verifyPhoneDto.phoneNumber);

      this.logger.log(`Numéro de téléphone ${phone.phoneNumber} vérifié avec succès`);

      return phone;
    } catch (error: any) {
      this.logger.error(`Erreur lors de la vérification du numéro de téléphone: ${error.message}`);
      throw new Error('Échec de la vérification du numéro de téléphone');
    }
  }

  /**
   * Met à jour un numéro de téléphone.
   * @param phoneId ID du numéro de téléphone.
   * @param updatePhoneDto DTO contenant les champs à mettre à jour.
   * @returns Le numéro de téléphone mis à jour.
   */
  async updatePhone(phoneId: number, updatePhoneDto: UpdatePhoneDto): Promise<Phone> {
    const phone = await this.phoneRepository.updatePhone(phoneId, updatePhoneDto);
    return phone;
  }

  /**
   * Supprime un numéro de téléphone.
   * @param phoneId ID du numéro de téléphone à supprimer.
   * @returns Le numéro de téléphone supprimé.
   */
  async deletePhone(phoneId: number): Promise<Phone> {
    const phone = await this.phoneRepository.deletePhone(phoneId);
    const existingUser = await this.userRepository.findById(phone.userId);
    if (!existingUser) {
      this.logger.error(`User not found with ID: ${phone.userId}`);
      throw new Error('User not found');
    }

    await this.userRepository.update(phone.userId, { authMethods: existingUser.authMethods.filter((method: AuthenticationMethod) => method !== AuthenticationMethod.PHONE) });

    return phone;
  }

  /**
   * Récupère tous les numéros de téléphone pour un utilisateur.
   * @param userId ID de l'utilisateur.
   * @returns Liste des numéros de téléphone.
   */
  async getAllPhones(userId: number): Promise<Phone[]> {
    return this.phoneRepository.getAllPhones(userId);
  }

  /**
   * Fonction pour envoyer un SMS de vérification via Twilio Verify.
   * @param phoneNumber Numéro de téléphone destinataire.
   */
  private async sendVerificationSMS(phoneNumber: string): Promise<void> {
    try {
      // Utiliser Twilio Verify pour envoyer le code de vérification
      const verification = await this.twilioClient.verify.v2.services(this.verifyServiceSid)
        .verifications
        .create({ to: phoneNumber, channel: 'sms' });

      this.logger.log(`Verification SMS envoyé à ${phoneNumber}, SID: ${verification.sid}`);
    } catch (error: any) {
      this.logger.error(`Erreur lors de l'envoi du SMS de vérification à ${phoneNumber}: ${error.message}`);
      throw new Error('Échec de l\'envoi du SMS de vérification');
    }
  }

  /**
   * Demande la validation MFA pour un utilisateur.
   * @param userId ID de l'utilisateur.
   */
  async requestMFA(userId: number): Promise<void> {
    // Demander la validation MFA via le service Twilio Verify
  }

  /**
   * Valide les données reçues pour un utilisateur.
   * @param userId ID de l'utilisateur.
   * @param data Données de validation (ex: code MFA, token, etc.)
   */
  async validateMFA(userId: number, data: any): Promise<boolean> {
    // S'assurer que data est un VerifyPhoneDto
    // Pourquoi sans class validator ?!! A CORRIGER
    if (!data.phoneNumber || !data.token) {
      throw new Error('Invalid MFA data');
    }
    // Valider le code MFA via le service Twilio Verify
    try {
      await this.verifyPhone(data as VerifyPhoneDto);
      return true;
    } catch (error) {
      return false;
    }
  }
}