import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/services/prisma.service';
import { User, UserAuthMethod } from '@prisma/client';
import { UserWithRelations } from '../../../../core/models/types/userWithRelations.type';

@Injectable()
export class AuthUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserWithRelations | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        web3Accounts: true,
        oauthAccounts: true,
        authenticator: true,
        phones: true,
        userAuthMethods: true,
        MFATokens: true,
        emailMFAToken: true,
        MFANonces: true,
        notifications: true,
        messages: true,
        oauthMFATokens: true,
        connectionHistories: true,
        passwordHistories: true,
        authMethodsHistories: true,
        serviceAccounts: true,
        preferences: true,
        profile: true,
      },
    });
  }

  async findBySecondaryEmail(secondaryEmail: string): Promise<UserWithRelations | null> {
    return this.prisma.user.findUnique({
      where: { secondaryEmail },
      include: {
        web3Accounts: true,
        oauthAccounts: true,
        authenticator: true,
        phones: true,
        userAuthMethods: true,
        MFATokens: true,
        emailMFAToken: true,
        MFANonces: true,
        notifications: true,
        messages: true,
        oauthMFATokens: true,
        connectionHistories: true,
        passwordHistories: true,
        authMethodsHistories: true,
        serviceAccounts: true,
        preferences: true,
        profile: true,

      },
    });
  }

  async findByPrimaryOrSecondaryEmail(email: string): Promise<UserWithRelations | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { secondaryEmail: email },
        ],
      },
      include: {
        web3Accounts: true,
        oauthAccounts: true,
        authenticator: true,
        phones: true,
        userAuthMethods: true,
        MFATokens: true,
        emailMFAToken: true,
        MFANonces: true,
        notifications: true,
        messages: true,
        oauthMFATokens: true,
        connectionHistories: true,
        passwordHistories: true,
        authMethodsHistories: true,
        serviceAccounts: true,
        preferences: true,
        profile: true,
      },
    });
  }

  async findById(id: number): Promise<UserWithRelations | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        web3Accounts: true,
        oauthAccounts: true,
        authenticator: true,
        phones: true,
        userAuthMethods: true,
        MFATokens: true,
        emailMFAToken: true,
        MFANonces: true,
        notifications: true,
        messages: true,
        oauthMFATokens: true,
        connectionHistories: true,
        passwordHistories: true,
        authMethodsHistories: true,
        serviceAccounts: true,
        preferences: true,
        profile: true,
      },
    });
  }

  async findByUsername(username: string): Promise<UserWithRelations | null> {
    return this.prisma.user.findUnique({
      where: { username },
      include: {
        web3Accounts: true,
        oauthAccounts: true,
        authenticator: true,
        phones: true,
        userAuthMethods: true,
        MFATokens: true,
        emailMFAToken: true,
        MFANonces: true,
        notifications: true,
        messages: true,
        oauthMFATokens: true,
        connectionHistories: true,
        passwordHistories: true,
        authMethodsHistories: true,
        serviceAccounts: true,
        preferences: true,
        profile: true,
      },
    });
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserWithRelations> {
    return this.prisma.user.create({
      data: userData,
      include: {
        web3Accounts: true,
        oauthAccounts: true,
        authenticator: true,
        phones: true,
        userAuthMethods: true,
        MFATokens: true,
        emailMFAToken: true,
        MFANonces: true,
        notifications: true,
        messages: true,
        oauthMFATokens: true,
        connectionHistories: true,
        passwordHistories: true,
        authMethodsHistories: true,
        serviceAccounts: true,
        preferences: true,
        profile: true,
      },
    });
  }

  async addAuthMethod(
    userId: number,
    authMethodData: Omit<UserAuthMethod, 'id' | 'createdAt' | 'userId'>
  ): Promise<UserAuthMethod> {
    return this.prisma.userAuthMethod.create({
      data: {
        userId,
        ...authMethodData,
      },
    });
  }

  async update(
    id: number,
    userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<UserWithRelations | null> {
    try {
      return this.prisma.user.update({
        where: { id },
        data: userData,
        include: {
          web3Accounts: true,
          oauthAccounts: true,
          authenticator: true,
          phones: true,
          userAuthMethods: true,
          MFATokens: true,
          emailMFAToken: true,
          MFANonces: true,
          notifications: true,
          messages: true,
          oauthMFATokens: true,
          connectionHistories: true,
          passwordHistories: true,
          authMethodsHistories: true,
          serviceAccounts: true,
          preferences: true,
          profile: true,
        },
      });
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      return null;
    }
  }

  async updatePassword(userId: number, newPassword: string): Promise<UserWithRelations> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
      include: {
        web3Accounts: true,
        oauthAccounts: true,
        authenticator: true,
        phones: true,
        userAuthMethods: true,
        MFATokens: true,
        emailMFAToken: true,
        MFANonces: true,
        notifications: true,
        messages: true,
        oauthMFATokens: true,
        connectionHistories: true,
        passwordHistories: true,
        authMethodsHistories: true,
        serviceAccounts: true,
        preferences: true,
        profile: true,
      },
    });
  }

  async updateEmail(userId: number, newEmail: string): Promise<UserWithRelations> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { email: newEmail },
      include: {
        web3Accounts: true,
        oauthAccounts: true,
        authenticator: true,
        phones: true,
        userAuthMethods: true,
        MFATokens: true,
        emailMFAToken: true,
        MFANonces: true,
        notifications: true,
        messages: true,
        oauthMFATokens: true,
        connectionHistories: true,
        passwordHistories: true,
        authMethodsHistories: true,
        serviceAccounts: true,
        preferences: true,
        profile: true,
      },
    });
  }

  async updateSecondaryEmail(userId: number, newSecondaryEmail: string): Promise<UserWithRelations> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { secondaryEmail: newSecondaryEmail },
      include: {
        web3Accounts: true,
        oauthAccounts: true,
        authenticator: true,
        phones: true,
        userAuthMethods: true,
        MFATokens: true,
        emailMFAToken: true,
        MFANonces: true,
        notifications: true,
        messages: true,
        oauthMFATokens: true,
        connectionHistories: true,
        passwordHistories: true,
        authMethodsHistories: true,
        serviceAccounts: true,
        preferences: true,
        profile: true,
      },
    });
  }

  async deleteSecondaryEmail(userId: number): Promise<UserWithRelations> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { secondaryEmail: null },
      include: {
        web3Accounts: true,
        oauthAccounts: true,
        authenticator: true,
        phones: true,
        userAuthMethods: true,
        MFATokens: true,
        emailMFAToken: true,
        MFANonces: true,
        notifications: true,
        messages: true,
        oauthMFATokens: true,
        connectionHistories: true,
        passwordHistories: true,
        authMethodsHistories: true,
        serviceAccounts: true,
        preferences: true,
        profile: true,
      },
    });
  }

  async updateEmailVerificationStatus(
    userId: number,
    isPrimaryEmailVerified?: boolean,
    isSecondaryEmailVerified?: boolean
  ): Promise<UserWithRelations | null> {
    const updateData: Partial<User> = {};

    if (isPrimaryEmailVerified !== undefined) {
      updateData.isEmailVerified = isPrimaryEmailVerified;
    }

    if (isSecondaryEmailVerified !== undefined) {
      updateData.isSecondaryEmailVerified = isSecondaryEmailVerified;
    }

    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: updateData,
        include: {
          web3Accounts: true,
          oauthAccounts: true,
          authenticator: true,
          phones: true,
          userAuthMethods: true,
          MFATokens: true,
          emailMFAToken: true,
          MFANonces: true,
          notifications: true,
          messages: true,
          oauthMFATokens: true,
          connectionHistories: true,
          passwordHistories: true,
          authMethodsHistories: true,
          serviceAccounts: true,
          preferences: true,
          profile: true,
        },
      });
    } catch (error) {
      console.error(`Error updating email verification status for user ID ${userId}:`, error);
      return null;
    }
  }
}