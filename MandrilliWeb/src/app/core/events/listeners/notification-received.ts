import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { ServerListener } from './base/server-listener';

export interface NotificationEventData extends Notification {
}

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'notification-received' server event.
 * Such event allows the client to listen for a notification
 * that is sent by the server as soon as the user associated with
 * the client receives it.
 */
Injectable({
    providedIn: "root"
})
export class NotificationReceivedListener extends ServerListener<NotificationEventData> {
    constructor(client: Socket) {
        super(client, 'notification-received');
    }
}
