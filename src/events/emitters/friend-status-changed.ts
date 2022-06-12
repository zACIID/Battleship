import { Types } from 'mongoose';
import { Server } from 'socket.io';

import { RoomEmitter } from './base/room-emitter';
import { FriendStatusChangedData } from '../../model/events/friend-status-changed-data';

/**
 * Class that wraps socket.io functionality to generate a "friend-status-changed" event
 * for a specific user.
 * Such event should be listened to by every logged user.
 */
export class FriendStatusChangedEmitter extends RoomEmitter<FriendStatusChangedData> {
    /**
     * @param ioServer socket.io server instance
     * @param toNotifyId id of the user that has to be notified
     */
    public constructor(ioServer: Server, toNotifyId: Types.ObjectId) {
        const eventName: string = 'friend-status-changed';

        super(ioServer, eventName, toNotifyId.toString());
    }
}
