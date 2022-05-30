import { BaseAuthenticatedApi } from './base-api';
import { Notification } from '../model/user/notification';

/**
 * Class that handles communication with relationship-related endpoints
 */
export class NotificationApi extends BaseAuthenticatedApi {
    public constructor(baseUrl: string, authToken: string) {
        super(baseUrl, authToken);
    }

    public getNotifications(userId: string): Notification[] {
        const reqPath: string = `/api/users/${userId}/notifications`;

        throw new Error("Not Implemented");
    }

    public addNotification(userId: string, n: Notification): boolean {
        const reqPath: string = `/api/users/${userId}/notifications`;

        throw new Error("Not Implemented");
    }

    public removeNotification(userId: string, n: Notification): boolean {
        const reqPath: string = `/api/users/${userId}/notifications`;

        throw new Error("Not Implemented");
    }
}
