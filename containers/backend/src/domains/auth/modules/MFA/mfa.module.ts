import { Module, forwardRef } from '@nestjs/common';
import { MFAController } from './controllers/mfa.controller';
import { MFARepository } from './repositories/mfa.repository';
import { MFAService } from './services/mfa.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from '../../common/common.module';
import { CommunicationDomain } from '../../../../domains/communication/communication.domain';

@Module({
  imports: [
    CommonModule,
    forwardRef(() => CommunicationDomain),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MFAController],
  providers: [
    MFAService,
    MFARepository,
  ],
  exports: [], 
})
export class MFAModule {}
