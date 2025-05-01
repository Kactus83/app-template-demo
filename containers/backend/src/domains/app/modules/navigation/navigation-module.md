# 🧭 Navigation Module Documentation

## Vue d'ensemble
Le module **Navigation** du domaine App gère la configuration et l'organisation de la navigation au sein de l'application. Il centralise la définition des menus et des parcours utilisateurs pour adapter l'interface selon les rôles et les préférences.

---

## Composants Clés

- **Configurations**
  - `adminNavigation.config.ts` : Définit la navigation spécifique aux administrateurs.
  - `userNavigation.config.ts` : Configure la navigation pour les utilisateurs standards.

- **Contrôleur**
  - `navigation.controller.ts` : Gère les requêtes relatives à la navigation.

- **Modèles**
  - **DTOs** :  
    - `navigation.dto.ts` : Structure les données de base pour la navigation.
    - `navigationItem.dto.ts` : Définit la structure des éléments individuels du menu.
  - **Interfaces** :
    - `INavigationModule.ts` : Spécifie les contrats d'implémentation du module.

- **Repository**
  - `navigation.repository.ts` : Fournit un accès aux données de navigation persistantes.

- **Service**
  - `navigation.service.ts` : Implémente la logique métier pour la gestion et la mise à jour des éléments de navigation.

---

## Utilisation
Ce module permet de générer et d’adapter dynamiquement la navigation de l'application. Il offre une interface centralisée pour définir, modifier et consulter les menus selon les besoins et les droits d'accès des utilisateurs.
