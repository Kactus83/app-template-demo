import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { OAuthService } from '../services/oauth.service';
import { OAuthProvider } from '../types/oauth-provider.type';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

/**
 * @module CustomOAuthSelectorComponent
 * @description
 * Composant unique pour la sélection OAuth.
 *
 * Ce composant affiche un bouton unique qui, lorsqu'il est cliqué,
 * ouvre un overlay compact (compatible mobile) affichant les icônes des fournisseurs OAuth disponibles.
 * L'utilisateur sélectionne le fournisseur souhaité et le flux d'authentification est déclenché.
 */
@Component({
  selector: 'custom-oauth-selector',
  templateUrl: './custom-oauth-selector.component.html',
  styleUrls: ['./custom-oauth-selector.component.scss'],
  imports: [MatIconModule, MatButtonModule, CommonModule]
})
export class CustomOAuthSelectorComponent implements OnInit, OnDestroy {
  showOverlay: boolean = false;
  // Liste des fournisseurs supportés (modifiable si nécessaire)
  providers: OAuthProvider[] = ['google', 'github', 'facebook'];

  constructor(private oauthService: OAuthService, private el: ElementRef) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  /**
   * Bascule l'affichage de l'overlay.
   */
  toggleOverlay(): void {
    this.showOverlay = !this.showOverlay;
  }

  /**
   * Lorsqu'un fournisseur est sélectionné, lance le flux OAuth et ferme l'overlay.
   * @param provider Le fournisseur OAuth sélectionné.
   */
  onProviderSelect(provider: OAuthProvider): void {
    this.oauthService.initiateOAuthLogin(provider);
    this.showOverlay = false;
  }

  /**
   * Ferme l'overlay si le clic se fait en dehors du composant.
   * @param event Événement de clic
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.showOverlay = false;
    }
  }
}
