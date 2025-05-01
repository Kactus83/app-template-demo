# 📄 Version Module Documentation

## Vue d'ensemble
Le module **Version** du domaine App gère la gestion, le suivi et la vérification des versions de l'application. Il assure que toutes les parties du système fonctionnent en cohérence et facilite la détection des mises à jour.

---

## Composants Clés

- **Configuration**
  - `version.config.ts` : Déclare et définit les paramètres liés à la version de l'application.

- **Contrôleur**
  - `version.controller.ts` : Expose les endpoints permettant de récupérer les informations de version.

- **Middlewares**
  - `version-check.middleware.ts` : Intercepte les requêtes pour vérifier la compatibilité de la version de l'application.

- **Modèles**
  - **DTO** :
    - `version.dto.ts` : Structure les données concernant la version.
  - **Interface** :
    - `IVersionModule.ts` : Définit le contrat d'implémentation du module version.

- **Repository**
  - `version.repository.ts` : Gère l'accès aux données relatives aux versions.

- **Service**
  - `version.service.ts` : Implémente la logique de suivi et de gestion des versions, facilitant les mises à jour et la vérification de compatibilité.

---

## Utilisation
Ce module assure un suivi rigoureux des versions de l'application, permettant d'identifier rapidement les incompatibilités et de garantir une cohérence entre les différents composants lors des déploiements et mises à jour.
