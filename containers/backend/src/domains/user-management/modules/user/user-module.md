# 👤 User Module Documentation

## Vue d'ensemble
Le module **User** gère toutes les opérations relatives aux utilisateurs, incluant la création, la mise à jour et la suppression des profils.

## Composants Clés
- **Contrôleur** : Gère les endpoints pour la gestion des utilisateurs.  
- **DTO** : Définissent la structure des données pour les opérations sur les utilisateurs.  
- **Repository** : Assure l'accès aux données utilisateurs.  
- **Service** : Implémente la logique métier de gestion des utilisateurs.  

## Nouveaux sous-modules

### Profil public (`UserProfileModule`)
- **Objectif** : stocker et exposer les informations publiques de l’utilisateur (bio, réseaux sociaux, bannière).  
- **Endpoints**  
  - `GET  /users/me/profile` → récupère le profil public  
  - `PATCH /users/me/profile` → met à jour bio / URLs dans `UserProfile`  
- **DTO**  
  - `UserProfileDto`  
  - `UpdateUserProfileDto`  

### Préférences (`UserPreferencesModule`)
- **Objectif** : gérer les préférences de l’utilisateur (locale, fuseau, thème).  
- **Endpoints**  
  - `GET  /users/me/preferences` → récupère les préférences  
  - `PATCH /users/me/preferences` → met à jour `UserPreferences`  
- **DTO**  
  - `UserPreferencesDto`  
  - `UpdateUserPreferencesDto`  

## Utilisation
Ce module est fondamental pour administrer les utilisateurs de l'application de manière cohérente et sécurisée, et offre désormais :
- une gestion centralisée du **profil public** (bio, réseaux, bannière),  
- une gestion dédiée des **préférences** (langue, timezone, thème),  
tout en conservant la logique existante de création/mise à jour du profil principal et de l’avatar.  
