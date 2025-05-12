import { Injectable } from '@nestjs/common';
import { UserSearchDto } from '../models/dto/user-search.dto';
import { UserSearchRepository } from '../repositories/user-search.repository';

@Injectable()
export class UserSearchService {
  constructor(private readonly userSearchRepository: UserSearchRepository) {}

  /**
   * Recherchez des utilisateurs en fonction de la requête.
   * @param query La chaîne de recherche pour le nom ou l'email.
   * @returns Tableau d'objets UserSearchDto contenant les informations des utilisateurs trouvés.
   */
  async searchUsers(query: string): Promise<UserSearchDto[]> {
    const users = await this.userSearchRepository.findUsersByQuery(query);

    // Transformation des objets User en UserSearchDto
    return users.map(user => {
      const dto = new UserSearchDto();
      dto.id = user.id;
      dto.firstName = user.firstName;
      dto.lastName = user.lastName;
      dto.username = user.username;
      dto.email = user.email;
      dto.avatar = user.avatar;
      return dto;
    });
  }
}
