/**
 * Cibles de scopes possibles pour un Service Account.
 */
export type ScopeTarget = 'AUTH' | 'USER' | 'BUSINESS';

/**
 * Permissions possibles pour un Service Account.
 */
export type ScopePermission = 'READ' | 'WRITE';

/**
 * Scope rattaché à un Service Account lors de la création.
 */
export interface CreateServiceAccountScopeDto {
  /** Domaine du scope */
  target: ScopeTarget;
  /** Permission associée */
  permission: ScopePermission;
}

/**
 * Payload pour créer un Service Account.
 */
export interface CreateServiceAccountDto {
  /** Libellé du compte (ex. "CLI principal") */
  name: string;
  /** Date limite de validité (ISO 8601), facultative */
  validTo?: string;
  /** Liste d’IP ou CIDR autorisées, facultative */
  allowedIps?: string[];
  /** Scopes à attacher au compte, facultatif */
  scopes?: CreateServiceAccountScopeDto[];
}

/**
 * Scope à modifier lors de la mise à jour.
 */
export interface UpdateServiceAccountScopeDto {
  /** Domaine du scope (optionnel, facultatif) */
  target?: ScopeTarget;
  /** Permission (optionnelle, facultative) */
  permission?: ScopePermission;
}

/**
 * Payload pour mettre à jour un Service Account.
 */
export interface UpdateServiceAccountDto {
  /** Nouveau libellé, facultatif */
  name?: string;
  /** Nouvelle date limite (ISO 8601), facultative */
  validTo?: string;
  /** Nouvelle liste d’IP/CIDR, facultative */
  allowedIps?: string[];
  /** Scopes à ajouter ou supprimer, facultatif */
  scopes?: UpdateServiceAccountScopeDto[];
}

/**
 * Scope tel que renvoyé par l’API.
 */
export interface ServiceAccountScopeDto {
  /** Domaine du scope */
  target: ScopeTarget;
  /** Permission associée */
  permission: ScopePermission;
}

/**
 * Représentation d’un Service Account renvoyée par l’API.
 */
export interface ServiceAccountDto {
  /** UUID du compte */
  id: string;
  /** Libellé */
  name: string;
  /** Identifiant public */
  clientId: string;
  /** Date de création (ISO 8601) */
  createdAt: string;
  /** Début de validité (ISO 8601) */
  validFrom: string;
  /** Fin de validité (ISO 8601) ou null */
  validTo: string | null;
  /** IP/CIDR autorisées */
  allowedIps: string[];
  /** Scopes attachés */
  scopes: ServiceAccountScopeDto[];
}

/**
 * Réponse de la création d’un Service Account, inclut le secret brut.
 */
export interface CreateServiceAccountResponseDto
  extends ServiceAccountDto {
  /** Secret généré à transmettre une seule fois */
  secret: string;
}