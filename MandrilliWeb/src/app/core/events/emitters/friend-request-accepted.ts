import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';

import { Emitter } from './base/emitter';

export interface FriendRequestAcceptedEventData {
    userToNotifyId: string;
    friendId: string;
}

/**
 * Class that wraps socket.io functionality to generate a "friend-request-accepted" event.
 * The client notifies the server that he has accepted the request,
 * so that the server can notify the sender that he has a new friend.
 */
Injectable({
    providedIn: "root"
})
export class FriendRequestAcceptedEmitter extends Emitter<FriendRequestAcceptedEventData> {
    public constructor(client: Socket) {
        super(client, `friend-request-accepted`);
    }
}
