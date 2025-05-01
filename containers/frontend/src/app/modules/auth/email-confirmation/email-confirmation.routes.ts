import { Routes } from '@angular/router';
import { EmailConfirmationComponent } from './email-confirmation.component';

export default [
    {
        // La route vide permet de charger ce module une fois la route parente (ex. "verify-email") définie dans appRoutes
        path: '',
        component: EmailConfirmationComponent,
    },
] as Routes;
