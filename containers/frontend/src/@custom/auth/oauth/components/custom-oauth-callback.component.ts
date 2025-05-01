import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from '../services/oauth.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

/**
 * @module CustomOAuthCallbackComponent
 * @description
 * Composant chargé de traiter le callback OAuth.
 *
 * Récupère les paramètres d'URL lors du retour d'un fournisseur OAuth,
 * appelle le service OAuth pour traiter ces paramètres et mettre à jour l'état d'authentification,
 * puis redirige l'utilisateur vers le dashboard ou, en cas d'erreur, vers la page de login.
 */
@Component({
  selector: 'custom-oauth-callback',
  templateUrl: './custom-oauth-callback.component.html',
  styleUrls: ['./custom-oauth-callback.component.scss'],
  imports: [CommonModule]
})
export class CustomOAuthCallbackComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  error: boolean = false;
  errorMessage: string = '';

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private oauthService: OAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        this.oauthService.handleOAuthCallback(params).subscribe({
          next: () => {
            this.loading = false;
            // Redirige vers le dashboard après authentification réussie
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('Erreur lors du traitement du callback OAuth', err);
            this.loading = false;
            this.error = true;
            this.errorMessage = 'Erreur lors de l’authentification. Redirection vers la page de connexion…';
            // Affiche l'erreur puis redirige vers la page de login après un délai
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
          }
        });
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
