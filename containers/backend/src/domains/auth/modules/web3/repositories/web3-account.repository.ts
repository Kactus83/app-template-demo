import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/services/prisma.service';
import { Web3Account } from '@prisma/client';

@Injectable()
export class Web3AccountRepository {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Crée un nouveau Web3Account lié à un utilisateur.
   * @param userId ID de l'utilisateur
   * @param wallet Adresse du portefeuille Ethereum
   * @returns Web3Account créé
   */
  async create(userId: number, wallet: string): Promise<Web3Account> {
    return this.prisma.web3Account.create({
      data: {
        userId,
        wallet,
      },
    });
  }

  /**
   * Trouve un Web3Account par adresse de portefeuille.
   * @param wallet Adresse du portefeuille Ethereum
   * @returns Web3Account ou null
   */
  async findByWallet(wallet: string): Promise<Web3Account | null> {
    return this.prisma.web3Account.findUnique({
      where: { wallet },
    });
  }

  /**
   * Trouve un Web3Account par ID.
   * @param id ID du Web3Account
   * @returns Web3Account ou null
   */
  async findById(id: number): Promise<Web3Account | null> {
    return this.prisma.web3Account.findUnique({
      where: { id },
    });
  }
  
  /**
   * Supprime un Web3Account par ID.
   * @param id ID du Web3Account
   * @returns Web3Account supprimé
   */
  async delete(id: number): Promise<Web3Account> {
    return this.prisma.web3Account.delete({
      where: { id },
    });
  }

  /**
   * Trouve tous les Web3Accounts pour un utilisateur.
   * @param userId ID de l'utilisateur
   * @returns Tableau de Web3Accounts
   */
  async findAllByUser(userId: number): Promise<Web3Account[]> {
    return this.prisma.web3Account.findMany({
      where: { userId },
    });
  }
}