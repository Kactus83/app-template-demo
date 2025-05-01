/**
 * @fileoverview Définition des routes pour le module User Profile.
 */

import { Routes } from '@angular/router';
import { UserProfileComponent } from 'app/modules/user/user-profile/user-profile.component';

export default [
    {
        path     : '',
        component: UserProfileComponent,
    },
] as Routes;
