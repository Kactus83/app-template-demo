import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseCardComponent } from '@fuse/components/card';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'site-overview',
    templateUrl: './site-overview.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatButtonModule,
        NgClass,
        FuseCardComponent,
        MatIconModule,
        RouterLink
    ],
})
export class SiteOverviewComponent {
    /**
     * Page d’accueil présentant l’ensemble du système.
     */
    constructor() {}
}
