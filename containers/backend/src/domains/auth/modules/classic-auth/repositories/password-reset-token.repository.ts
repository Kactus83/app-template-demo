import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/services/prisma.service';
import { PasswordResetToken } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PasswordResetTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createToken(userId: number): Promise<PasswordResetToken> {
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 3600000); // Token valid for 1 hour

    return this.prisma.passwordResetToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    return this.prisma.passwordResetToken.findFirst({
      where: {
        token,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.passwordResetToken.delete({
      where: { id },
    });
  }
}