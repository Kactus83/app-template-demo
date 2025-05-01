import { OAuthProviderType } from "../types/oauth-provider.type";

export interface IOAuthProfile {
  id: string;
  displayName?: string;
  name?: {
    givenName?: string;
    familyName?: string;
  };
  emails?: { value: string }[];
  photos?: { value: string }[];
  provider: OAuthProviderType;
}