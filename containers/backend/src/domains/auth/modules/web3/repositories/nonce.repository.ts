import { Injectable } from '@nestjs/common';
import { Nonce , MFANonce } from '@prisma/client';

import { PrismaService } from '../../../../../core/services/prisma.service';

@Injectable()
export class NonceRepository {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Crée un nouveau nonce pour un portefeuille donné.
   * @param wallet Adresse du portefeuille
   * @param nonce Nonce associé au portefeuille
   * @returns Le nonce créé
   */
  async create(wallet: string, nonce: string): Promise<Nonce> {
    return this.prisma.nonce.create({
      data: {
        wallet,
        nonce,
      },
    });
  }

  /**
   * Crée un nouveau nonce pour l'authentification MFA.
   * @param wallet Adresse du portefeuille
   * @param nonce Nonce associé au portefeuille
   * @returns Le nonce créé
   */
  async createMFANonce(userId: number, wallet: string, nonce: string): Promise<MFANonce> {
    return this.prisma.mFANonce.create({
      data: {
        userId,
        wallet,
        nonce,
      },
    });
  }

  /**
   * Supprime tous les nonces associés à un utilisateur.
   * @param userId ID de l'utilisateur
   * @returns Tableau des nonces supprimés
   */
  async deleteUserMFANonces(userId: number): Promise<MFANonce[]> {
    const nonces = await this.prisma.mFANonce.findMany({
      where: { userId },
    });
    await this.prisma.mFANonce.deleteMany({
      where: { userId },
    });
    return nonces;
  }  

  /**
   * Supprime un nonce MFA par son ID.
   * @param id ID du nonce à supprimer
   * @returns Le nonce supprimé
   */
  async deleteWalletMFANonce(wallet: string): Promise<MFANonce> {
    return this.prisma.mFANonce.delete({
      where: { wallet },
    });
  }

  /**
   * Marque un nonce MFA comme validé pour un wallet spécifique.
   * @param wallet Adresse du portefeuille
   */
  async markMFANonceAsValidated(wallet: string): Promise<void> {
    await this.prisma.mFANonce.update({
      where: { wallet },
      data: { hasBeenValidated: true },
    });
  }

  /**
   * Recherche un nonce par son ID.
   * @param id ID du nonce à rechercher
   * @returns Le nonce trouvé ou null s'il n'existe pas
   */
  findMFANonceByWallet(wallet: string): Promise<MFANonce | null> {
    return this.prisma.mFANonce.findUnique({
      where: { wallet },
    });
  }

  /**
   * Recherche un nonce par l'adresse du portefeuille.
   * @param wallet Adresse du portefeuille à rechercher
   * @returns Le nonce trouvé ou null s'il n'existe pas
   */
  async findByWallet(wallet: string): Promise<Nonce | null> {
    return this.prisma.nonce.findUnique({
      where: { wallet },
    });
  }

  /**
   * Supprime un nonce par son ID.
   * @param id ID du nonce à supprimer
   * @returns Le nonce supprimé
   */
  async delete(id: number): Promise<Nonce> {
    return this.prisma.nonce.delete({
      where: { id },
    });
  }

  /**
   * Supprime un nonce par l'adresse du portefeuille.
   * @param wallet Adresse du portefeuille à supprimer
   * @returns Le nonce supprimé
   */
  async deleteByWallet(wallet: string): Promise<Nonce> {
    return this.prisma.nonce.delete({
      where: { wallet },
    });
  }
}