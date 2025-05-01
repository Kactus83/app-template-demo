import { Injectable } from '@nestjs/common';
import { Phone } from '@prisma/client';
import { PrismaService } from '../../../../../core/services/prisma.service';
import { UpdatePhoneDto } from '../models/dto/update-phone.dto';

@Injectable()
export class PhoneRepository {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Récupère tous les numéros de téléphone pour un utilisateur donné.
   * @param userId ID de l'utilisateur.
   * @returns Liste des numéros de téléphone ou une liste vide.
   */
  async findAllByUserId(userId: number): Promise<Phone[]> {
    return this.prisma.phone.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Récupère un numéro de téléphone par son ID.
   * @param id ID du numéro de téléphone.
   * @returns Le numéro de téléphone ou null s'il n'existe pas.
   */
  async findById(id: number): Promise<Phone | null> {
    return this.prisma.phone.findUnique({
      where: { id },
    });
  }

  /**
   * Ajoute un nouveau numéro de téléphone pour un utilisateur.
   * @param userId ID de l'utilisateur.
   * @param phoneNumber Numéro de téléphone à ajouter.
   * @returns Le numéro de téléphone créé.
   */
  async addPhone(userId: number, phoneNumber: string): Promise<Phone> {
    return this.prisma.phone.create({
      data: {
        userId,
        phoneNumber,
        isVerified: false,
      },
    });
  }

  /**
   * Met à jour un numéro de téléphone.
   * @param phoneId ID du numéro de téléphone.
   * @param updatePhoneDto Données à mettre à jour.
   * @returns Le numéro de téléphone mis à jour.
   */
  async updatePhone(phoneId: number, updatePhoneDto: UpdatePhoneDto): Promise<Phone> {
    return this.prisma.phone.update({
      where: { id: phoneId },
      data: updatePhoneDto,
    });
  }

  /**
   * Vérifie un numéro de téléphone.
   * @param phoneId ID du numéro de téléphone.
   * @returns Le numéro de téléphone mis à jour.
   */
  async verifyPhone(phoneId: number): Promise<Phone> {
    return this.prisma.phone.update({
      where: { id: phoneId },
      data: { isVerified: true },
    });
  }

  /**
   * Supprime un numéro de téléphone.
   * @param phoneId ID du numéro de téléphone.
   * @returns Le numéro de téléphone supprimé.
   */
  async deletePhone(phoneId: number): Promise<Phone> {
    return this.prisma.phone.delete({
      where: { id: phoneId },
    });
  }

  /**
   * Récupère tous les numéros de téléphone de l'utilisateur.
   * @param userId ID de l'utilisateur.
   * @returns Liste des numéros de téléphone de l'utilisateur.
   */
  async getAllPhones(userId: number): Promise<Phone[]> {
    return this.prisma.phone.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Vérifie un numéro de téléphone en le marquant comme vérifié.
   * @param phoneNumber Numéro de téléphone à vérifier.
   * @returns Le numéro de téléphone mis à jour.
   */
  async verifyPhoneByNumber(phoneNumber: string): Promise<Phone> {
    return this.prisma.phone.update({
      where: { phoneNumber },
      data: { isVerified: true },
    });
  }
}