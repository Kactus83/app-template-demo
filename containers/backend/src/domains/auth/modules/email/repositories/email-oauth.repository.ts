import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/services/prisma.service';
import { OAuthAccount } from '@prisma/client';

@Injectable()
export class EmailOAuthAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Trouve un compte OAuth par ID.
   * @param id Identifiant du compte OAuth.
   * @returns Le compte OAuth correspondant ou null s'il n'existe pas.
   */
  async findMultipleByUserEmail(email: string): Promise<OAuthAccount[]> {
    return this.prisma.oAuthAccount.findMany({
      where: {
        user: {
          OR: [
            { email },
            { secondaryEmail: email },
          ],
        },
      },
    });
  }

  /**
   * Supprime un compte OAuth.
   * @param id Identifiant du compte OAuth.
   */
  async deleteOAuthAccount(id: number): Promise<void> {
    await this.prisma.oAuthAccount.delete({
      where: { id },
    });
  }
}