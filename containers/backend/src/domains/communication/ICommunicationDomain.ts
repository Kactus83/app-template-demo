import { IMessagesModule } from "./modules/messages/models/interfaces/IMessagesModule";
import { INotificationsModule } from "./modules/notifications/models/interfaces/INotificationsModule";

/**
 * Interface du domaine de communication.
 * Entends les interfaces des autres modules pour les regrouper.
 */
export interface ICommunicationDomain extends INotificationsModule, IMessagesModule {
}