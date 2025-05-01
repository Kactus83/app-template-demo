import { Module, forwardRef } from '@nestjs/common';
import { AuthSettingsController } from './controllers/auth-settings.controller';
import { PrismaService } from '../../../../core/services/prisma.service';
import { AuthSettingsService } from './services/auth-settings.service';
import { AuthSettingsRepository } from './repository/auth-settings.repository';
import { CommunicationDomain } from '../../../../domains/communication/communication.domain';
import { CommonModule } from '../../common/common.module';
import { AuthUserRepository } from '../../common/repositories/auth-user.repository';

@Module({
  imports: [
    CommonModule,
    forwardRef(() => CommunicationDomain),
  ],
  controllers: [AuthSettingsController],
  providers: [
    AuthSettingsService,
    AuthSettingsRepository,
    AuthUserRepository,
    PrismaService,
  ],
  exports: [AuthSettingsService],
})
export class AuthSettingsModule {}
