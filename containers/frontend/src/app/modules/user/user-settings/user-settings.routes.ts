/**
 * @fileoverview Définition des routes pour le module User Settings.
 */

import { Routes } from '@angular/router';
import { UserSettingsComponent } from 'app/modules/user/user-settings/user-settings.component';

export default [
    {
        path     : '',
        component: UserSettingsComponent,
    },
] as Routes;
