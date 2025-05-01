/**
 * @module CommunicationDomain
 * @include communication-domain.md
 *
 * Ce barrel regroupe l'ensemble des éléments du domaine "Communication".
 * Ce domaine gère la communication avec l'utilisateur et fournit une interface
 * pour que les autres domaines puissent générer des messages et des notifications.
 */
export * from './communication.domain';
export * from './communication.service';
export * from './ICommunicationDomain';

// Réexport des barrels des modules du domaine Communication
export * from './modules/messages/messages-module.barrel';
export * from './modules/notifications/notifications-module.barrel';
