/**
 * Contrat pour un adapter de stockage.
 *
 * Toute implémentation (locale ou cloud) devra respecter ce contrat.
 *
 * @interface IStorageAdapter
 * @category Core
 * @subcategory Modules - Storage
 */
export interface IStorageAdapter {
  /**
   * Upload d'un fichier depuis un chemin local vers une destination donnée dans le système de stockage.
   *
   * @param filePath - Chemin local du fichier à uploader.
   * @param destination - Chemin (ou nom) de destination dans le stockage.
   * @returns Une promesse qui se résout en renvoyant l'URL publique du fichier uploadé.
   */
  uploadFile(filePath: string, destination: string): Promise<string>;

  /**
   * Suppression d'un fichier du système de stockage.
   *
   * @param fileName - Nom (ou chemin relatif) du fichier à supprimer.
   * @returns Une promesse qui se résout lorsque l'opération est terminée.
   */
  deleteFile(fileName: string): Promise<void>;
}
