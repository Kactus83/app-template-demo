/**
 * DTO représentant les métadonnées du client liées
 * au dispositif et au navigateur.
 *
 * @category Metadata
 * @subcategory Models - DTOs
 */
export interface MetadataDto {
  /** Horodatage de l’appel (ISO 8601) */
  timestamp: string;

  /** Langue + région du navigateur (navigator.language) */
  locale: string;

  /** Fuseau horaire client (Intl.DateTimeFormat().resolvedOptions().timeZone) */
  timeZone: string;

  /** Chaîne User-Agent complète */
  userAgent: string;

  /** Nom du navigateur (Chrome, Firefox, etc.) */
  browserName: string;

  /** Version du navigateur */
  browserVersion: string;

  /** Nom du système d’exploitation (Windows, macOS, etc.) */
  osName: string;

  /** Version du système d’exploitation */
  osVersion: string;

  /** Type d’appareil : "desktop" | "tablet" | "mobile" */
  deviceType: 'desktop' | 'tablet' | 'mobile';

  /** Résolution écran sous la forme "largeurxhauteur" */
  screenResolution: string;
}
