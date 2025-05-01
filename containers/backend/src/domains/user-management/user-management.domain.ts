import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CommunicationDomain } from '../communication/communication.domain';
import { UserModule } from './modules/user/user.module';
import { UserShortcutsModule } from './modules/user-shortcuts/user-shortcuts.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'user-management',
        module: UserManagementDomain,
        children: [
          { path: 'user', module: UserModule },
          { path: 'shortcuts', module: UserShortcutsModule },
        ],
      },
    ]),
    UserModule,
    UserShortcutsModule,
    CommunicationDomain,
  ],
})
export class UserManagementDomain {}