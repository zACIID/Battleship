import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { ServerListener } from './base/server-listener';

export interface FriendOnlineEventData {
    friendId: string;
}

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'friend-online' server event.
 * Such event allows the client to get notified by the server when
 * one of the user's friends comes online.
 */
Injectable({
    providedIn: 'root',
});
export class FriendOnlineListener extends ServerListener<FriendOnlineEventData> {
    constructor(client: Socket) {
        super(client, 'friend-online');
    }
}
