import { Module, forwardRef } from '@nestjs/common';
import { PhoneController } from './controllers/phone.controller';
import { PhoneService } from './services/phone.service';
import { PhoneRepository } from './repositories/phone.repository';
import { ConfigModule } from '@nestjs/config';
import { CommunicationDomain } from '../../../../domains/communication/communication.domain';
import { PhoneMFAService } from './services/phone-mfa.service';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    forwardRef(() => CommonModule),
    forwardRef(() => CommunicationDomain), 
    ConfigModule,
  ],
  controllers: [PhoneController],
  providers: [PhoneService, PhoneRepository, PhoneMFAService],
  exports: [PhoneMFAService],
})
export class PhoneModule {}