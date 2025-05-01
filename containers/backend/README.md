# Backend – Auth-Boilerplate

## Description
Ce backend fait partie du projet d’authentification multi-méthodes et est construit avec **NestJS** et **Prisma**. Il adopte une architecture modulaire et respecte les principes **SOLID** pour une évolutivité et une maintenabilité optimales.

> **Note importante** : les secrets ne sont pas fournis via un fichier `.env` mais récupérés via **Vault**. Ce backend n’est pas destiné à être déployé seul. L’ensemble du projet est orchestré par **Docker Compose** et divers **scripts shell** qui gèrent le déploiement de chaque container.

---

## 📌 Table des matières
- [Présentation générale](#présentation-générale)
- [Structure du projet](#structure-du-projet)
- [Processus de build et déploiement](#processus-de-build-et-déploiement)
- [Bonnes pratiques et annotations](#bonnes-pratiques-et-annotations)

---

## 🔍 Présentation générale
Le backend est conçu pour servir de **noyau** à l’authentification et aux interactions avec la base de données via **Prisma**. Il communique avec d’autres services (*Vault, Blockchain, Frontend, etc.*) grâce à une orchestration complète en **Docker**.

La structure repose sur une séparation claire entre :
- **Le code central (`core`)** : modules globaux (*filtres, guards, middlewares, modèles et services partagés*).
- **Les domaines fonctionnels généraux (`domains`)** : *auth, app, communication, search, user-management, web3, etc.*
- **Les domaines fonctionnels à venir (`domains`)** : Pas encore présent, mais on doit faciliter une intégration fluide qui s'appuie sur les domaines généraux pour développer n'importe quel type d'app. 

---

## 📂 Structure du projet
📌 À la racine :
- **Fichiers de configuration** : `.eslintrc.js`, `tsconfig.json`, `nest-cli.json`, `Dockerfile`, etc.
- **Dossier `prisma`** : contient le schéma Prisma et les migrations.

📌 **Dossier `src`** :
- **`core/`** : modules globaux (*filtres, guards, middlewares, modèles et services partagés*).
- **`domains/`** : chaque domaine (*auth, app, communication, etc.*) contient :
  - `controllers/`
  - `services/`
  - `repositories/`
  - `DTO/`, `interfaces/` et autres utilitaires spécifiques.

📌 **Dossier `test/`** : contient les tests end-to-end.

---

## ⚙️ Processus de build et déploiement

- Compilation avec **NestJS** :
  ```sh
  npm run build
  ```
- **Dockerfile** en approche **multi-étapes** :
  1. Étape `builder` :
     - Image **Alpine** pour installer les dépendances.
     - Génération du client **Prisma**.
     - Compilation de l’application.
     - Exécution des **tests** et du **lintage** pour assurer un code irréprochable.
  2. Étape finale :
     - Image **slim** avec uniquement les dépendances de production.
     - Copie du code compilé et des modules Prisma nécessaires.
     - Ajout de **dépendances système essentielles** (*comme OpenSSL*).

- **Script d’entry point (`entrypoint.sh`)** :
  - Attend l'initialisation des dépendances (*Vault, Database, Web3, MailHog*).
  - Exécute les migrations Prisma.
  - Lance le serveur.

---

## ✅ Bonnes pratiques et annotations

- Respect des **standards ESLint et Prettier**.
- **Améliorations suggérées** :
  - Ajouter des **commentaires JSDoc** sur les classes et méthodes.
  - Vérifier la **cohérence de la mise en forme** (*via Prettier*).
  - Harmoniser la **nomenclature** (*DTO, interfaces, types*).
  - Examiner les **règles ESLint désactivées** et les réintégrer si possible.

---

📌 **Ce backend est une brique essentielle du projet, conçu pour être robuste et évolutif.** 🔥
