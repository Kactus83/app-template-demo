import { Routes } from '@angular/router';
import { AuthOAuthCallbackComponent } from './oauth-callback.component';

export default [
    {
        path: '',
        component: AuthOAuthCallbackComponent,
    },
] as Routes;
