import { Prisma } from '@prisma/client';

/**
 * Type représentant un utilisateur "complet" avec toutes ses relations de base de donnée.
 * @category Core
 * @category Types
 */
export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    web3Accounts: true;
    oauthAccounts: true;
    authenticator: true;
    phones: true;
    MFATokens: true;
    emailMFAToken: true;
    MFANonces: true;
    notifications: true;
    messages: true;
    oauthMFATokens: true;
    userAuthMethods: true;
  };
}>;
