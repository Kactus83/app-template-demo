/**
 * Représente un template CLI embarqué.
 */
export interface Template {
  /** Identifiant interne du template */
  id: number;
  /** Nom unique du template (ex. "blog", "e-commerce") */
  name: string;
  /** Description succincte (facultative) */
  description?: string;
}

/**
 * Statistiques globales d’un template.
 */
export interface TemplateGlobalStats {
  /** Identifiant du template */
  templateId: number;
  /** Nombre total de téléchargements */
  total: number;
}

/**
 * Statistiques de téléchargement d’un template pour un utilisateur.
 */
export interface TemplateUserStats {
  /** Identifiant de l’utilisateur */
  userId: number;
  /** Nombre de téléchargements effectués par cet utilisateur */
  count: number;
}
