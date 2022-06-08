import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { ServerListener } from './base/server-listener';

export interface NotificationEventData extends Notification {}

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'notification-received' server event.
 * Such event allows the user to be notified when a new request
 * is sent to him.
 */
Injectable({
    providedIn: 'root',
});
export class NotificationReceivedListener extends ServerListener<NotificationEventData> {
    constructor(client: Socket) {
        super(client, 'notification-received');
    }
}
