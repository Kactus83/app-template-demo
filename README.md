# Boilerplate d'Authentification Multi-Méthodes avec Angular, Node.js, PostgreSQL et Docker

## Description du projet

Ce projet est un boilerplate complet pour une application web avec authentification multi-méthodes, incluant :
- Authentification classique (email et mot de passe),
- Authentification via OAuth (Google, Facebook, GitHub),
- Authentification Web3 (wallets blockchain).

Il est conçu pour être facilement extensible et maintenable, en respectant les principes SOLID et les meilleures pratiques de développement. Le backend utilise Node.js et Express avec TypeScript, le frontend est développé avec Angular, et la base de données est PostgreSQL. Le tout est conteneurisé avec Docker pour faciliter le développement et le déploiement.

## Technologies utilisées

### Vault
- **Vault** : Utilisé pour la gestion sécurisée des secrets et des variables d'environnement critiques comme les clés API, les tokens d'authentification, et autres informations sensibles. Vise a remplacer l'utilisation des variables d'environement pour les secrets.
  - Le backend récupère les secrets directement depuis Vault via un volume partagé Docker.
  - Les rôles et politiques de Vault sont définis pour limiter l'accès aux secrets selon le principe du moindre privilège.

### Blockchain
- **Solidity** : Langage de programmation pour les contrats intelligents.
- **Hardhat** : Environnement de développement pour Ethereum permettant de déployer et tester des contrats Solidity localement.
- **OpenZeppelin Contracts** : Bibliothèque standard de contrats intelligents sécurisés.
- **Ethers.js** : Bibliothèque JavaScript pour interagir avec les wallets Web3 et les contrats Solidity.

### Backend
- **Node.js** : Environnement JavaScript côté serveur.
- **Express.js** : Framework minimaliste pour construire des API RESTful.
- **TypeScript** : Superset de JavaScript pour un typage statique.
- **Prisma ORM** : Gestion de la base de données PostgreSQL via un ORM moderne.
- **JSON Web Tokens (JWT)** : Authentification stateless par tokens.
- **Passport.js** : Middleware pour l'authentification OAuth.
- **Winston** : Gestion avancée des logs.
- **Sentry** : Monitoring et gestion des erreurs.

### Frontend
- **Angular** : Framework pour construire des applications web dynamiques.
- **Ethers.js** : Bibliothèque JavaScript pour interagir avec les wallets Web3.

### Base de données
- **PostgreSQL** : Base de données relationnelle.
- **Prisma** : ORM moderne pour faciliter les migrations et la gestion des données.

### Conteneurisation
- **Docker** : Conteneurisation des services blockchain, backend, frontend et base de données.
- **Docker Compose** : Orchestration des conteneurs qui ont chacun un script shell de déploiement.

## Structure du projet

### Deployments

Ce dossier contiens les informations en transit entre les différents conteneurs docker durant le deploiement de l'app (Qui devront a terme transiter de maniere plus sécurisée). Son contenu est réinitialisé par le conteneur deployment lors de chaque dockercompose.

A terme il faudra pouvoir gérer des reset selectifs.

### Vault
  - **vault/** : Contient les scripts et configurations nécessaires à la gestion des secrets via Vault.
    - **scripts/** : Scripts pour initialiser et configurer Vault (e.g. `entrypoint.sh`, `populate_secrets.sh`, etc.).
    - **config/** : Fichier de configuration Vault pour définir les rôles, politiques, et accès aux secrets.
    - **Dockerfile** : Fichier de configuration pour le conteneur Docker Vault.

### Contrats Web3

Les contrats Solidity sont situés dans le dossier `contracts/` et sont déployés sur un nœud local Hardhat. Cette architecture permet de tester et de déployer facilement les contrats intelligents en développement.

- **contracts/**
  - **Auth.sol** // A VENIR
  - **GovernanceToken.sol** // A VENIR
  - **GovernanceContract.sol** // A VENIR
  - **TokenContract.sol**
  - **NFTContract.sol**
  - **MultiVault.sol**
  - **README.md** : Documentation détaillée des contrats Solidity.

Les types TypeScript pour les contrats Solidity sont générés automatiquement grâce à TypeChain lors de la compilation des contrats. Ces types permettent d'interagir avec les contrats de manière type-safe dans les différentes parties de l'application.

Les types sont partagés entre le backend et la blockchain via Docker volumes, garantissant que les services backend peuvent utiliser les définitions de contrat les plus récentes sans duplication de code.

- **Dossier des types dans la blockchain** : `blockchain/types`
- **Dossier des types dans le backend** : `backend/src/domains/web3/modules/dynamic/models/types`

### Backend

Le backend utilise Node.js et Express, écrit en TypeScript, avec une architecture modulaire basée sur des **domaines** et des **modules**. Cette architecture respecte les principes SOLID et est conçue pour être facilement extensible et maintenable. La gestion des données est faite via Prisma, un ORM moderne pour PostgreSQL.

- **backend/**
  - **src/** : Contient le code source de l'application backend.
    - **index.ts** : Point d'entrée de l'application.
    - **domains/** : Organisation du code par domaines fonctionnels.
      - **[nom-du-domaine]/**
        - **[nom-du-domaine].domain.ts** : Fichier principal du domaine.
        - **modules/** : Contient les modules spécifiques au domaine.
          - **[nom-du-module]/**
            - **controllers/** : Les contrôleurs Express qui gèrent les requêtes HTTP pour ce module.
            - **services/** : La logique métier spécifique au module.
            - **repositories/** : Interactions avec la base de données via Prisma.
            - **routes/** : Définition des routes associées au module.
            - **models/** : Les modèles de données, DTO (Data Transfer Objects) et interfaces.
            - **middlewares/** : Middlewares spécifiques au module.
            - **utils/** : Fonctions utilitaires spécifiques au module.
            - **[nom-du-module].module.ts** : Fichier principal du module.
    - **shared/** : Contient le code partagé entre les différents domaines.
      - **config/** : Configuration globale de l'application (Prisma, Logger, Passport, Swagger, etc.).
      - **middlewares/** : Middlewares globaux de l'application (authentification, autorisation, gestion des erreurs, etc.).
      - **utils/** : Fonctions utilitaires globales (emailService, jwt, prismaClient, tokenGenerator, etc.).
      - **models/** : Modèles et types globaux.
      - **types/** : Définitions de types TypeScript partagées.
  - **prisma/** : Contient le schéma Prisma (`schema.prisma`) et les migrations de la base de données.
  - **logs/** : Dossier pour stocker les logs générés par Winston.
  - **Dockerfile** : Fichier de configuration pour la création de l'image Docker du backend.
  - **entrypoint.sh** : Script de démarrage pour exécuter des tâches comme la migration de la base de données avant de lancer le serveur.

### Frontend

Le frontend est une application Angular qui utilise des composants standalone, ce qui permet une meilleure isolation et une réutilisabilité accrue des composants. Le cœur de l'application se compose de services partagés pour la gestion de l'authentification, des utilisateurs, et d'autres fonctionnalités globales.

- **frontend/**
  - **src/** : Contient le code source de l'application Angular.
    - **app/** : Dossier principal contenant la logique métier et la structure de l'application.
      - **core/** : Ce dossier contient les services centraux utilisés dans toute l'application.
        - **auth/** : Services et outils pour la gestion de l'authentification (authentification classique, OAuth, Web3).
        - **web3/** : Services et outils pour la gestion de la connectivité web3.
        - **icons/** : Gestion des icônes personnalisées utilisées dans l'interface.
        - **navigation/** : Services pour la gestion de la navigation dans l'application.
        - **user/** : Services pour la gestion des utilisateurs (profils, rôles, etc.).
      - **layout/** : Composants liés à la mise en page de l'application, tels que les en-têtes, les barres latérales, etc.
      - **modules/** : Modules fonctionnels de l'application, chacun étant indépendant.
        - **auth/** : Pages et composants liés à l'authentification (inscription, connexion, réinitialisation de mot de passe).
        - **user/** : Pages et composants liés à la gestion du profil utilisateur et des comptes OAuth/Web3.
    - **assets/** : Contient les ressources statiques comme les images, les fichiers de style CSS, etc.
    - **environments/** : Contient les configurations des environnements (développement, production).
  - **angular.json** : Fichier de configuration Angular.
  - **Dockerfile** : Fichier de configuration pour la création de l'image Docker du frontend.

### Base de données

- **database/** : Ce dossier contient la configuration de la base de données PostgreSQL. Il inclut le Dockerfile pour la création du conteneur PostgreSQL.

## Principes SOLID

Le projet est conçu en respectant les principes SOLID, garantissant ainsi une architecture propre, maintenable et extensible. L'utilisation de l'architecture basée sur les domaines et les modules renforce ces principes. Voici comment ils sont appliqués :

- **Single Responsibility Principle (SRP)** : Chaque module et service dans le backend a une responsabilité unique. Les domaines séparent les préoccupations fonctionnelles majeures, et les modules au sein des domaines encapsulent des fonctionnalités spécifiques. Par exemple, le domaine **auth** contient des modules comme **classic-auth**, **oauth**, **web3**, etc., chacun gérant une méthode d'authentification spécifique.
- **Open/Closed Principle (OCP)** : L'architecture modulaire permet d'étendre le système en ajoutant de nouveaux domaines ou modules sans modifier le code existant. De nouvelles fonctionnalités peuvent être ajoutées sous forme de modules ou de domaines supplémentaires.
- **Liskov Substitution Principle (LSP)** : Les services et interfaces sont conçus pour être substituables par des implémentations plus spécifiques sans affecter le reste de l'application, facilitant ainsi les évolutions.
- **Interface Segregation Principle (ISP)** : Les interfaces sont définies de manière spécifique pour chaque module ou service, évitant des interfaces générales trop larges et augmentant la cohésion du code.
- **Dependency Inversion Principle (DIP)** : Les modules et services dépendent d'abstractions (interfaces) plutôt que de classes concrètes, ce qui facilite les tests unitaires et l'intégration de nouvelles fonctionnalités.


- **Single Responsibility Principle (SRP)** : Chaque classe/service dans le backend a une responsabilité unique. Par exemple, les services d'authentification, de gestion des utilisateurs, et de gestion des sessions sont séparés.
- **Open/Closed Principle (OCP)** : Le code est conçu pour être facilement extensible sans modification du code existant. Par exemple, de nouvelles méthodes d'authentification peuvent être ajoutées sans modifier les services actuels.
- **Liskov Substitution Principle (LSP)** : Les services peuvent être substitués par des implémentations plus spécifiques sans affecter la logique de haut niveau.
- **Interface Segregation Principle (ISP)** : Les interfaces sont définies de manière à ne contenir que les méthodes nécessaires à chaque service.
- **Dependency Inversion Principle (DIP)** : Les services dépendent d'abstractions et non de classes concrètes, facilitant ainsi le test unitaire et l'intégration de nouvelles fonctionnalités.

## Instructions de lancement

### Prérequis
Avant de lancer le projet, assurez-vous d'avoir installé les outils suivants :
- **Docker** : [Installer Docker](https://docs.docker.com/get-docker/)
- **Node.js** (si vous voulez démarrer le frontend en dehors de Docker) : [Installer Node.js](https://nodejs.org/)
- **Angular CLI** (pour le développement frontend local) : `npm install -g @angular/cli`

### Lancer avec Docker Compose

1. Créez un fichier .env 

Le fichier `.env` contient toutes les variables d'environnement nécessaires pour configurer le backend, la base de données, OAuth, et les services de messagerie. Voici un exemple de fichier `.env` :

```bash
# Variables pour Prisma (ORM)
DATABASE_URL="postgresql://my_user:my_password@database:5432/my_database?schema=public"

# Variables pour PostgreSQL
POSTGRES_USER=my_user
POSTGRES_PASSWORD=my_password
POSTGRES_DB=my_database

# Configuration du serveur Node.js
PORT=3000
NODE_ENV=development
```

Explication des variables :

```bash
DATABASE_URL : URL de connexion à la base de données PostgreSQL pour Prisma.
POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB : Identifiants pour PostgreSQL.
PORT : Port sur lequel l'application backend écoute (par défaut 3000).
NODE_ENV : Environnement d'exécution (development, production).
```

ces variables ont pour vocation de disparaitre au profit de l'utilisation de vault.

2. Dans le terminal, exécutez la commande suivante pour construire et lancer les conteneurs Docker :

```bash
docker-compose up --build
```

Cela va démarrer le backend à l'adresse http://localhost:3000 et la base de données PostgreSQL.


3. Lancer uniquement le frontend Angular en mode développement avec rechargement à chaud dans un autre terminal :

```bash
Copier le code
cd frontend
ng serve
```

L'application Angular sera disponible à l'adresse http://localhost:4200.

### Lancer tous les services avec profil frontend :
Pour lancer l'ensemble des services (backend, base de données, MailHog, et frontend), utilisez le profil frontend de Docker Compose :

```bash
docker-compose --profile frontend up --build
```

Cela inclura le frontend dans l'orchestration Docker et tous les services seront conteneurisés.

### Scripts de démarrage

Le projet inclut deux scripts (`start.sh` pour Linux/Mac et `start.bat` pour Windows) afin de simplifier le démarrage du projet et d'effectuer des opérations supplémentaires comme la réinitialisation de la base de données ou des logs.

#### Options disponibles

- **reset-db** : Réinitialiser la base de données en supprimant le contenu du dossier `database/data`.
- **reset-logs** : Supprimer tous les logs du backend en nettoyant le dossier `backend/logs`.

#### Modes disponibles

- **dev** : Démarre les services Docker (sans frontend) et exécute `ng serve` pour le frontend Angular afin de bénéficier du rechargement à chaud.
- **all** : Démarre tous les services (backend, base de données, MailHog, frontend) via Docker Compose.

#### Exemple d'utilisation

1. Lancer en mode développement avec réinitialisation de la base de données :
```bash
./start.sh reset-db dev
```

2. Lancer tous les services avec réinitialisation des logs :

```bash
./start.sh reset-logs all
```

#### Aide
Pour obtenir de l'aide sur l'utilisation des scripts, utilisez l'option --help :

```bash
./start.sh --help
```
Les mêmes commandes peuvent être utilisées avec le script start.bat sur Windows.

## Gestion des Erreurs et des Logs

Le projet utilise **Winston** pour la gestion des logs et **Sentry** pour la surveillance des erreurs critiques en production.

- **Winston** : 
  - Winston gère la rotation quotidienne des logs et conserve les erreurs critiques dans des fichiers dédiés (par exemple, `logs/error.log`).
  - Les logs sont enregistrés à différents niveaux : `info`, `warn`, et `error`.
  - Les fichiers de logs sont stockés dans le dossier `backend/logs`.

- **Sentry** : 
  - Sentry est utilisé pour capturer et signaler les erreurs en production.
  - L'intégration de **winston-transport-sentry-node** permet de rediriger les erreurs critiques directement vers Sentry.
  - Les informations capturées incluent des traces stack complètes, permettant une détection rapide des bugs.
  
### Configuration des logs dans Winston
Les logs sont configurés pour créer un fichier par jour avec une rétention de 14 jours :
```typescript
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new DailyRotateFile({
      filename: 'logs/all-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d'
    })
  ]
});
```

## Authentification Multi-Méthodes

Ce projet implémente plusieurs méthodes d'authentification pour permettre aux utilisateurs de se connecter de différentes manières, selon leurs préférences. Il s'agit d'un système modulaire qui intègre les méthodes suivantes :

### 1. Authentification classique (Email et Mot de Passe)

Les utilisateurs peuvent s'inscrire et se connecter en utilisant leur adresse email et un mot de passe. Ce processus suit les bonnes pratiques de sécurité pour la gestion des mots de passe et des sessions.

#### Processus d'inscription :
- L'utilisateur fournit un email valide et un mot de passe.
- Le mot de passe est hashé à l'aide de **bcrypt** avant d'être stocké dans la base de données.
- Un token JWT est généré pour l'utilisateur et lui est renvoyé après une inscription réussie.

#### Processus de connexion :
- L'utilisateur fournit son email et son mot de passe.
- Le mot de passe est vérifié par rapport au hash stocké dans la base de données.
- Un token JWT est généré pour les utilisateurs valides et renvoyé pour authentifier leurs futures requêtes.

#### Points techniques :
- **Hashage des mots de passe** : bcrypt est utilisé pour sécuriser les mots de passe avant stockage.
- **Validation des entrées** : Le backend vérifie que les données fournies respectent les critères de sécurité (taille minimale du mot de passe, format de l'email, etc.).
- **JWT** : Utilisation de tokens JWT pour une authentification stateless.

### 2. Authentification OAuth (Google, Facebook, GitHub)

L'intégration avec OAuth permet aux utilisateurs de se connecter via des comptes tiers (Google, Facebook, GitHub). Ce type d'authentification simplifie l'inscription et la connexion en évitant à l'utilisateur de créer un nouveau compte local.

#### Fournisseurs OAuth pris en charge :
- **Google**
- **Facebook**
- **GitHub**

#### Processus d'authentification OAuth :
1. L'utilisateur clique sur l'un des boutons de connexion (Google, Facebook, ou GitHub).
2. Il est redirigé vers la page d'authentification du fournisseur choisi.
3. Une fois l'utilisateur authentifié par le fournisseur, il est redirigé vers l'application avec un code d'autorisation.
4. Le backend utilise ce code pour obtenir les informations de l'utilisateur et le connecter ou créer un compte local si nécessaire.

#### Points techniques :
- **Passport.js** : Utilisation de stratégies OAuth fournies par Passport pour Google, Facebook, et GitHub.
- **Relations Prisma** : Le modèle `OAuthAccount` stocke les informations relatives à l'authentification des utilisateurs avec les fournisseurs OAuth.
- **Liens de comptes** : Si un utilisateur possède déjà un compte local (email), le compte OAuth est lié à son compte existant.

#### Exemples de routes :
- `/auth/google`
- `/auth/facebook`
- `/auth/github`

### 3. Authentification Web3 (Wallets Blockchain)

L'authentification Web3 permet aux utilisateurs de se connecter à l'application en utilisant leurs wallets blockchain, tels que MetaMask. Cette méthode est particulièrement utile pour les applications décentralisées ou toute autre plateforme liée à la blockchain.

#### Processus d'authentification Web3 :
1. L'utilisateur connecte son wallet (par exemple, MetaMask) à l'application.
2. Le backend génère un nonce unique (chaîne de caractères aléatoire) et l'envoie à l'utilisateur.
3. L'utilisateur signe ce nonce avec son wallet pour prouver qu'il en possède le contrôle.
4. Le backend vérifie la signature et, si elle est valide, authentifie l'utilisateur en créant ou en récupérant un compte associé à ce wallet.

#### Points techniques :
- **Ethers.js** : Bibliothèque utilisée pour interagir avec les wallets Web3 côté frontend.
- **Vérification des signatures** : Le backend utilise les méthodes cryptographiques d'Ethers.js pour valider la signature du nonce.
- **Nonce** : Un nonce unique est généré pour chaque tentative de connexion, stocké dans la base de données, et lié à un utilisateur une fois authentifié.

#### Exemple de routes :
- `/auth/web3/request-nonce` : Demande de nonce pour un wallet donné.
- `/auth/web3/authenticate` : Vérification de la signature du nonce et authentification de l'utilisateur.

#### Wallets pris en charge :
- MetaMask
- WalletConnect
- Et d'autres wallets compatibles Web3.

### 4. Gestion des Comptes Multiples

Les utilisateurs peuvent gérer plusieurs méthodes d'authentification à partir de leur profil utilisateur. Cela inclut la possibilité de lier/délier des comptes OAuth et des wallets Web3 en plus de leur compte classique.

#### Fonctionnalités :
- Lier plusieurs adresses OAuth à un même compte utilisateur.
- Lier plusieurs wallets blockchain à un même compte utilisateur.
- Dissocier un compte OAuth ou un wallet de son compte utilisateur principal.

### 5. Gestion des Sessions et Sécurité

#### Authentification Stateless avec JWT :
Chaque méthode d'authentification renvoie un **JSON Web Token (JWT)**, qui est stocké côté client et utilisé pour authentifier les futures requêtes HTTP.

#### Points de sécurité :
- **Expiration des tokens** : Les tokens JWT sont configurés pour expirer après un certain temps, forçant l'utilisateur à se reconnecter.
- **CSRF et XSS** : Les communications entre le frontend et le backend sont sécurisées via des en-têtes HTTP et des tokens CSRF pour empêcher les attaques Cross-Site Request Forgery.
- **Vérification des tokens** : Chaque requête envoyée au backend doit contenir un JWT valide dans les en-têtes d'autorisation, sinon l'accès est refusé.

### Exemples de Tokens JWT :
- Authentification classique et OAuth : Les tokens JWT incluent des informations basiques sur l'utilisateur (id, email).
- Authentification Web3 : Les tokens JWT incluent l'adresse du wallet authentifié.

## Architecture Backend et ORM Prisma

Le backend est développé avec Node.js et Express.js, en utilisant TypeScript pour assurer un typage statique et une meilleure maintenabilité du code. Prisma est utilisé comme ORM pour gérer la base de données PostgreSQL, ce qui permet de simplifier la modélisation des données et les interactions avec la base de données.

### Structure Backend

L'architecture du backend respecte les principes SOLID, avec une séparation claire des responsabilités. Voici les principales couches de l'application :

- **Domains** : Chaque domaine représente une partie fonctionnelle spécifique de l'application (par exemple, **auth**, **communication**, **user-management**, etc.).
  - **Modules** : À l'intérieur de chaque domaine, les modules correspondent à des fonctionnalités spécifiques.
    - **controllers/** : Gestion des requêtes HTTP et des réponses pour le module.
    - **services/** : Logique métier spécifique au module, incluant les interactions avec la base de données via Prisma.
    - **repositories/** : Couche d'accès aux données, permettant d'interagir avec la base de données de manière abstraite.
    - **routes/** : Définition des routes API pour le module.
    - **models/** : DTO (Data Transfer Objects), interfaces et types spécifiques au module.
    - **middlewares/** : Middlewares spécifiques au module.
    - **utils/** : Fonctions utilitaires spécifiques au module.
    - **[nom-du-module].module.ts** : Fichier principal du module, qui assemble les différentes parties du module.
  - **[nom-du-domaine].domain.ts** : Fichier principal du domaine, qui assemble les modules du domaine.
- **Shared** : Code partagé entre les différents domaines et modules.
  - **config/** : Configuration globale de l'application (Prisma, Logger, Passport, etc.).
  - **middlewares/** : Middlewares globaux utilisés par l'ensemble de l'application.
  - **utils/** : Fonctions utilitaires globales.
  - **models/** : Modèles et types globaux.
  - **types/** : Définitions de types TypeScript partagées.

Cette organisation modulaire permet une isolation claire des fonctionnalités, facilite les tests unitaires et rend le code plus maintenable et extensible.


### Modèles de Données Prisma

Les modèles de données sont définis dans le fichier `schema.prisma` et incluent :

- **User** : 
  - Gère les informations de base de l'utilisateur, telles que l'email, le nom, les rôles, et l'avatar.
  - Contient les méthodes d'authentification associées (`AuthenticationMethod`), y compris les méthodes principales, secondaires et tertiaires.
  - Relations :
    - **PasswordResetToken** : Tokens pour la réinitialisation des mots de passe.
    - **EmailChangeToken** : Tokens pour le changement d'email.
    - **EmailVerificationToken** : Tokens pour la vérification des emails.
    - **SecondaryEmailDeletionToken** : Tokens pour la suppression des emails secondaires.
    - **Web3Account** : Comptes Web3 associés.
    - **OAuthAccount** : Comptes OAuth via des fournisseurs tiers.
    - **Authenticator** : Données pour l'authentificateur TOTP.
    - **Phone** : Numéros de téléphone associés.
    - **MFAToken** : Tokens d'authentification multi-facteurs.
    - **EmailMFAToken** : Tokens MFA liés aux emails.
    - **MFANonce** : Nonces MFA pour les wallets.
    - **Notification** : Notifications envoyées à l'utilisateur.
    - **OAuthMFAToken** : Tokens MFA pour les comptes OAuth.

- **MFAToken** :
  - Gère les tokens d'authentification multi-facteurs pour des actions sécurisées spécifiques (`SecureAction`).
  - Champs :
    - `token` : Token unique.
    - `action` : Type d'action sécurisée (e.g., CHANGE_EMAIL, DELETE_ACCOUNT).
    - `stepsValidated` et `stepsRequired` : Étapes d'authentification validées et requises.
    - `expiresAt` : Date d'expiration du token.
    - `used` : Indique si le token a été utilisé.
  - Relations :
    - **User** : Utilisateur associé.

- **Notification** :
  - Stocke les notifications envoyées aux utilisateurs.
  - Champs :
    - `title`, `description`, `icon`, `image`, `time`, `link` : Détails de la notification.
    - `useRouter` : Indique si le lien utilise le router interne.
    - `read` : Indique si la notification a été lue.
  - Relations :
    - **User** : Utilisateur destinataire.

- **Authenticator** :
  - Stocke les données pour les authentificateurs (par exemple, TOTP).
  - Champs :
    - `secret` : Clé secrète pour TOTP.
    - `qrCodeURL` : URL du QR code pour configurer l'authentificateur.
    - `enabled` : Indique si l'authentificateur est activé.
  - Relations :
    - **User** : Utilisateur associé.

- **Phone** :
  - Gère les numéros de téléphone associés aux utilisateurs.
  - Champs :
    - `phoneNumber` : Numéro de téléphone unique.
    - `isVerified` : Indique si le numéro est vérifié.
  - Relations :
    - **User** : Utilisateur associé.
    - **PhoneVerificationToken** : Tokens de vérification associés.

- **PhoneVerificationToken** :
  - Gère les tokens de vérification pour les numéros de téléphone.
  - Champs :
    - `token` : Token unique.
    - `expiresAt` : Date d'expiration du token.
  - Relations :
    - **Phone** : Numéro de téléphone associé.

- **Web3Account** :
  - Gère les comptes Web3 (wallets blockchain) associés aux utilisateurs.
  - Champs :
    - `wallet` : Adresse du wallet unique.
  - Relations :
    - **User** : Utilisateur associé.

- **OAuthAccount** :
  - Gère les comptes OAuth des utilisateurs via des fournisseurs tiers comme Google, Facebook, GitHub.
  - Champs :
    - `provider` : Nom du fournisseur OAuth.
    - `providerId` : ID unique fourni par le fournisseur.
    - `email` : Email associé au compte OAuth.
    - `accessToken` et `refreshToken` : Tokens OAuth.
  - Relations :
    - **User** : Utilisateur associé.

- **OAuthMFAToken** :
  - Gère les tokens MFA liés aux comptes OAuth.
  - Champs :
    - `provider` : Nom du fournisseur OAuth.
    - `providerId` : ID unique du fournisseur.
    - `token` : Token unique.
    - `hasBeenValidated` : Indique si le token a été validé.
    - `expiresAt` : Date d'expiration du token.
  - Relations :
    - **User** : Utilisateur associé.

- **PasswordResetToken** :
  - Gère les tokens de réinitialisation de mot de passe.
  - Champs :
    - `token` : Token unique.
    - `expiresAt` : Date d'expiration du token.
  - Relations :
    - **User** : Utilisateur associé.

- **EmailChangeToken** :
  - Gère les tokens de changement d'email.
  - Champs :
    - `emailType` : Type d'email (PRIMARY ou SECONDARY).
    - `newEmail` : Nouvel email unique.
    - `token` : Token unique.
    - `expiresAt` : Date d'expiration du token.
  - Relations :
    - **User** : Utilisateur associé.

- **EmailVerificationToken** :
  - Gère les tokens de vérification d'email.
  - Champs :
    - `emailType` : Type d'email (PRIMARY ou SECONDARY).
    - `token` : Token unique.
    - `expiresAt` : Date d'expiration du token.
  - Relations :
    - **User** : Utilisateur associé.

- **SecondaryEmailDeletionToken** :
  - Gère les tokens de suppression d'email secondaire.
  - Champs :
    - `token` : Token unique.
    - `expiresAt` : Date d'expiration du token.
  - Relations :
    - **User** : Utilisateur associé.

- **EmailMFAToken** :
  - Gère les tokens MFA pour les emails.
  - Champs :
    - `code` : Code unique.
    - `expiresAt` : Date d'expiration du token.
    - `validated` : Indique si le token a été validé.
  - Relations :
    - **User** : Utilisateur associé.

- **Nonce** :
  - Gère les nonces utilisés pour l'authentification Web3.
  - Champs :
    - `wallet` : Adresse du wallet unique.
    - `nonce` : Chaîne de caractères aléatoire unique.
  - Relations :
    - Aucun.

- **MFANonce** :
  - Gère les nonces MFA pour les wallets.
  - Champs :
    - `wallet` : Adresse du wallet unique.
    - `nonce` : Chaîne de caractères aléatoire unique.
    - `hasBeenValidated` : Indique si le nonce a été validé.
  - Relations :
    - **User** : Utilisateur associé.

- **Version** :
  - Gère les versions de l'application backend et frontend.
  - Champs :
    - `backend` : Version du backend.
    - `frontend` : Version du frontend.
    - `createdAt` : Date de création.
    - `updatedAt` : Date de mise à jour.

#### Enums

- **AuthenticationMethod** :
  - Types d'authentification disponibles :
    - `CLASSIC`
    - `EMAIL`
    - `OAUTH`
    - `WEB3`
    - `AUTHENTICATOR`
    - `PHONE`

- **SecureAction** :
  - Types d'actions sécurisées nécessitant une authentification multi-facteurs :
    - `CHANGE_EMAIL`
    - `DELETE_ACCOUNT`
    - `ALL`

- **EmailType** :
  - Types d'emails gérés :
    - `PRIMARY`
    - `SECONDARY`

Ces modèles permettent de gérer une authentification multi-méthodes complète, incluant des méthodes classiques, OAuth, Web3, ainsi que des fonctionnalités avancées telles que la gestion des notifications, des tokens MFA, et des vérifications d'email et de téléphone.



### Gestion des Migrations

Prisma facilite la gestion des migrations de base de données. Chaque modification des modèles génère une migration qui est appliquée à la base de données PostgreSQL.

### Intégration de Prisma

Prisma Client est généré automatiquement et utilisé dans les services pour interagir avec les modèles de données. Cela permet des interactions typesafe et optimisées avec la base de données.
