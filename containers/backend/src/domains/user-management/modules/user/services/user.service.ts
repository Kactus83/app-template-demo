import { Injectable, Inject, Optional, forwardRef } from '@nestjs/common';
import { UserWithRelations } from '../../../../../core/models/types/userWithRelations.type';
import { UserUpdateDto } from '../models/dto/user-update.dto';
import { ICommunicationDomain } from '../../../../../domains/communication/ICommunicationDomain';
import { UserRepository } from '../repository/user.repository';
import { CommunicationDomain } from '../../../../../domains/communication/communication.domain';
import { StorageService } from 'src/core/modules/storage/services/storage.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Optional() @Inject(forwardRef(() => CommunicationDomain))
    private readonly communicationDomain?: ICommunicationDomain,
    // Le StorageService est utilisé pour l'upload de fichiers.
    private readonly storageService?: StorageService,
  ) {}

  /**
   * Récupère les informations de l'utilisateur actuel.
   *
   * @param userId - ID de l'utilisateur.
   * @returns L'utilisateur avec ses relations ou null si non trouvé.
   */
  async getCurrentUser(userId: number): Promise<UserWithRelations | null> {
    return this.userRepository.findById(userId);
  }

  /**
   * Met à jour les informations du profil de l'utilisateur.
   *
   * Cette méthode peut être utilisée pour mettre à jour le profil, y compris l'avatar,
   * lorsque l'utilisateur fournit une URL déjà hébergée.
   *
   * @param userId - ID de l'utilisateur.
   * @param userUpdateDto - Données de mise à jour.
   * @returns L'utilisateur mis à jour avec ses relations ou null si non trouvé.
   */
  async updateUser(userId: number, userUpdateDto: UserUpdateDto): Promise<UserWithRelations | null> {
    const updatedUser = await this.userRepository.update(userId, userUpdateDto);

    if (this.communicationDomain) {
      await this.communicationDomain.createNotification(userId, {
        title: 'Information',
        description: 'You have updated your profile! Thanks.',
        time: new Date(),
        read: false,
      });
    }

    return updatedUser;
  }

  /**
   * Met à jour l'avatar de l'utilisateur à partir d'un fichier uploadé.
   *
   * Cette méthode utilise le StorageService pour uploader le fichier et met ensuite
   * à jour le profil de l'utilisateur avec l'URL générée.
   *
   * @param userId - ID de l'utilisateur.
   * @param localFilePath - Chemin local du fichier temporaire.
   * @param destinationFileName - Chemin relatif de destination dans le stockage.
   * @returns L'utilisateur mis à jour avec l'avatar ou null si non trouvé.
   * @throws {Error} Si le StorageService n'est pas disponible.
   */
  async updateUserAvatar(userId: number, localFilePath: string, destinationFileName: string): Promise<UserWithRelations | null> {
    if (!this.storageService) {
      throw new Error('StorageService non disponible');
    }
    const avatarUrl = await this.storageService.uploadFile(localFilePath, destinationFileName);
    return this.userRepository.update(userId, { avatar: avatarUrl });
  }
}
