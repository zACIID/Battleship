import { RequestTypes } from '../database/user/notification';

export interface NotificationData {
    /**
     * Type of the notification
     */
    type: RequestTypes;

    /**
     * Id of the user that sent the notification
     */
    sender: string;
}
