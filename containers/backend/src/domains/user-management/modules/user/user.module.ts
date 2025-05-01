import { Module, forwardRef } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { CommunicationDomain } from '../../../../domains/communication/communication.domain';

@Module({
  imports: [
    forwardRef(() => CommunicationDomain),
  ],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}