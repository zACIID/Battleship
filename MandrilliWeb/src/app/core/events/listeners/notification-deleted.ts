import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { ServerListener } from './base/server-listener';

export interface NotificationEventData extends Notification {}

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'notification-deleted' server event.
 * Such event allows the user to be notified when one of his
 * notification was deleted by the server.
 */
Injectable({
    providedIn: 'root',
});
export class NotificationDeletedEvent extends ServerListener<NotificationEventData> {
    constructor(client: Socket) {
        super(client, 'notification-deleted');
    }
}
