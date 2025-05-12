import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/services/prisma.service';
import { UserWithRelations } from '../../../../core/models/types/userWithRelations.type';

@Injectable()
export class Web3UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<UserWithRelations | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        web3Accounts: true,
        oauthAccounts: true,
        authenticator: true,
        phones: true,
        MFATokens: true,
        emailMFAToken: true,
        MFANonces: true,
        notifications: true,
        userAuthMethods: true,
        messages: true,
        oauthMFATokens: true,
        connectionHistories: true,
        passwordHistories: true,
        authMethodsHistories: true,
        
      },
    });
  }

  async findByWallet(wallet: string): Promise<UserWithRelations | null> {
    return this.prisma.user.findFirst({
      where: {
        web3Accounts: {
          some: { wallet },
        },
      },
      include: {
        web3Accounts: true,
        oauthAccounts: true,
        authenticator: true,
        phones: true,
        MFATokens: true,
        emailMFAToken: true,
        MFANonces: true,
        notifications: true,
        userAuthMethods: true,
        messages: true,
        oauthMFATokens: true,
        connectionHistories: true,
        passwordHistories: true,
        authMethodsHistories: true,
      },
    });
  }
}
