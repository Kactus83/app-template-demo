# 🛠️ Services Accounts Module

## Vue d'ensemble
Le **ServicesAccountsModule** offre :
- **Gestion** des comptes de service :
  - Création, mise à jour, rotation de secret, révocation.
  - Association et synchronisation des scopes (cibles + permissions).
- **Authentification** machine-to-machine :
  - Flux OAuth2 “client_credentials” pour obtenir un JWT scoped.
  - Vérification de validité temporelle, IP whitelist et secret.

## Composants clés

### Controllers
- `ServiceAccountsManagementController` : endpoints CRUD et rotation.
- `ServiceAccountAuthController` : endpoint `POST /service-accounts/token`.

### Services
- `ServiceAccountsManagementService` : logique métier de gestion.
- `ServiceAccountAuthService` : logique d’émission de JWT.

### Repository
- `UserServiceAccountRepository` : accès Prisma aux tables `UserServiceAccount` et `ServiceAccountScope`.

### DTOs
- `CreateServiceAccountDto`, `UpdateServiceAccountDto`, `ServiceAccountDto`  
- `IssueTokenDto`, `JwtServiceAccountPayloadDto`

## Endpoints principaux

| Méthode | Route                                     | Description                           |
| ------- | ----------------------------------------- | ------------------------------------- |
| POST    | `/service-accounts`                      | Crée un compte de service             |
| GET     | `/service-accounts`                      | Liste les comptes de l’utilisateur    |
| PUT     | `/service-accounts/:id`                  | Met à jour un compte                  |
| DELETE  | `/service-accounts/:id`                  | Révoque un compte                     |
| POST    | `/service-accounts/:id/rotate`           | Tourne le secret                     |
| POST    | `/service-accounts/token`                | Émet un JWT via client_credentials   |

## Sécurité et bonnes pratiques
- **JWT scopes** : chaque token inclut ses scopes `"target:permission"`.  
- **IP whitelist** : optionnelle, configurée par compte.  
- **Token short-lived** : 15 minutes par défaut.  
- **SRP & modularité** : gestion et auth clairement séparées.

---