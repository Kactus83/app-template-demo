import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import { createClient, RedisClientType } from 'redis';

/**
 * Middleware pour la gestion des sessions avec Redis via express-session.
 * Cette implémentation remplace le MemoryStore par RedisStore,
 * garantissant la persistance et le partage des sessions
 * dans un environnement multi-processus ou cloud.
 *
 * @category Core
 * @category Middlewares
 */
@Injectable()
export class SessionMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SessionMiddleware.name);
  private readonly redisClient: RedisClientType;
  private readonly redisStore: connectRedis.RedisStore;

  /**
   * Initialise le middleware de session :
   * - Crée et connecte le client Redis (URL récupérée depuis ConfigService)
   * - Instancie RedisStore pour express-session
   *
   * @param configService Fournit REDIS_URL et SESSION_SECRET depuis Vault
   */
  constructor(private readonly configService: ConfigService) {
    this.logger.log('Initialisation du middleware de session avec RedisStore…');

    const redisUrl = this.configService.get<string>('REDIS_URL')!;
    this.redisClient = createClient({ url: redisUrl });

    // Gestion des erreurs de connexion Redis
    this.redisClient.on('error', err => this.logger.error('Redis Client Error', err));

    // Connexion au serveur Redis
    this.redisClient
      .connect()
      .then(() => this.logger.log(`Connecté à Redis (${redisUrl}) pour les sessions`))
      .catch(err => this.logger.error('Échec de la connexion à Redis', err));

    // Création du store Redis pour express-session
    const RedisStore = connectRedis(session);
    this.redisStore = new RedisStore({ client: this.redisClient });
  }

  /**
   * Applique express-session en utilisant RedisStore créé.
   * Conserve les mêmes options (secret, resave, cookie…) qu’auparavant.
   *
   * @param req Requête entrante
   * @param res Réponse à envoyer
   * @param next NextFunction pour passer au middleware suivant
   */
  use(req: Request, res: Response, next: NextFunction): void {
    session({
      store: this.redisStore,
      secret: this.configService.get<string>('SESSION_SECRET')!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 jour en millisecondes
      },
    })(req, res, next);
  }
}
