import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/services/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserSearchRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Recherche des utilisateurs par nom ou email en utilisant une requête insensible à la casse.
   * @param query La chaîne de recherche.
   * @returns Tableau d'objets User correspondant aux critères de recherche.
   */
  async findUsersByQuery(query: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { username: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }
}
