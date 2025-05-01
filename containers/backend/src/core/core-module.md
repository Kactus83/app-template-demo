# 📌 Core Module Documentation

## 🔍 Vue d'ensemble
Le **Core Module** constitue le **socle fondamental** de l'application backend. Il centralise et fournit les **composants essentiels** utilisés par l’ensemble des domaines métiers (*Auth, User Management, etc.*). L’objectif est d’avoir une infrastructure **robuste, réutilisable et facile à maintenir** pour supporter les différentes fonctionnalités de l’application.

---

## 🎯 Philosophie et état d'esprit

### ✅ Modularité et Réutilisabilité
Le **Core Module** regroupe tous les **services et outils communs** (*configuration, logging, sécurité, gestion de la base de données, etc.*) afin de les rendre **accessibles globalement** à travers l’application. Cela permet :
- Une **meilleure réutilisation du code**.
- Une **réduction des duplications**.

### 🔧 Centralisation de la Configuration
- La configuration est **chargée et validée au démarrage** via le **module de configuration** et **Vault**.
- Cela garantit que toutes les **variables essentielles sont bien définies** et correctement formatées avant l'initialisation de l'application.

### 🔒 Sécurité et Fiabilité
- La **gestion des tokens (JWT)** et la **sécurisation des accès** sont **centralisées**.
- **AuthGuard** protège les endpoints sensibles en vérifiant les accès et les rôles.
- Les **secrets** récupérés depuis **Vault** sont injectés dans `process.env` pour assurer une gestion **sécurisée** des informations sensibles.

### 📊 Observabilité et Monitoring
- **Système de logging avancé** basé sur **Winston** : suivi des événements, erreurs et exceptions.
- **Intégration de Sentry** : surveillance proactive des incidents en production.

---

## 🏗️ Composants Clés

### 🛠️ **Configuration**
- **`AppConfigModule`** : Charge les variables d’environnement et intègre la validation via **Vault**.
- **`ConfigLoaderService`** : Valide la configuration et fusionne les secrets avec les variables d’environnement.
- **`AppConfig & EnvConfig`** : Classes définissant les variables attendues.

### 📜 **Logging**
- **`LoggerModule`** : Fournit un service de **logging global**.
- **`LoggerService`** : Basé sur **Winston**, il gère :
  - Les logs.
  - La rotation quotidienne.
  - L’enregistrement des erreurs et leur transmission à **Sentry**.

### 🔐 **Sécurité**
- **`AuthGuard`** : Protège les **endpoints sensibles** en validant les tokens **JWT** et en contrôlant les rôles.
- **`JwtUtilityService`** : Fournit des outils pour gérer et vérifier les **tokens JWT**.

### 🗄️ **Accès aux données**
- **`PrismaService`** : Gère la **connexion et l’interaction** avec la base de données.
- **`MainUserRepository`** : Contient les **méthodes d'accès aux données utilisateur**.

### 🔍 **Monitoring & Santé de l’Application**
- **`HealthModule & HealthController`** : Exposent un **endpoint de health check** pour surveiller l’état de l’application.

### 🔑 **Gestion des secrets**
- **`VaultModule & VaultService`** :
  - Interagissent avec le serveur **Vault** pour récupérer et valider les secrets.
  - Injectent les secrets dans **`process.env`**.

---

## 🚀 Utilisation et Extension
Le **Core Module** est marqué comme **Global**, ce qui signifie :
✅ **Tous les autres modules** de l’application peuvent l’utiliser **sans nécessiter d’importation répétée**.

### Comment étendre le Core Module ?
1. **Créer un nouveau domaine métier** en s’appuyant sur les composants **exposés** par le **Core Module**.
2. **Utiliser directement les services existants** :
   - `LoggerService` pour la journalisation.
   - `PrismaService` pour l'accès à la base de données.
   - `AuthGuard` pour la protection des endpoints.
3. **Ajouter et valider toute nouvelle configuration ou secret** via `AppConfigModule` et `VaultService`.

---

📌 **Le Core Module est un élément structurant garantissant la cohérence et la robustesse de l’application.** 🔥
