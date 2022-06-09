import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';

import { Emitter } from './base/emitter';
import { FriendRequestAcceptedData } from '../../model/events/friend-request-accepted-data';

export interface FriendRequestAcceptedEventData {
    /**
     * Id of the user to notify (the sender)
     */
    userToNotifyId: string;

    /**
     * Id of the new friend (user that accepted the request)
     */
    friendId: string;
}

/**
 * Class that wraps socket.io functionality to generate a "friend-request-accepted" event.
 * The client notifies the server that he has accepted the request,
 * so that the server can notify the sender that he has a new friend.
 */
@Injectable({
    providedIn: 'root',
})
export class FriendRequestAcceptedEmitter extends Emitter<FriendRequestAcceptedData> {
    public constructor(client: Socket) {
        super(client, `friend-request-accepted`);
    }
}
