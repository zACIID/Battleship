import { Notification } from './notification';

export interface NotificationOverview extends Notification {
    /**
     * username of the sender
     */
    senderUsername: string;
}
