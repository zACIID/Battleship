import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { ServerListener } from './base/server-listener';
import { UserStatus } from '../../model/user/user';

export interface FriendStatusChangedData {
    friendId: string;
    status: UserStatus;
}

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'friend-status-changed' server event.
 * Such event allows the client to get notified by the server when
 * one of the user's friends changes his status.
 */
Injectable({
    providedIn: 'root',
});
export class FriendStatusChangedListener extends ServerListener<FriendStatusChangedData> {
    constructor(client: Socket) {
        super(client, 'friend-status-changed');
    }
}
