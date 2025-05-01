import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'health',
    standalone   : true,
    templateUrl  : './health.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class HealthComponent
{
    constructor()
    {
    }
}
