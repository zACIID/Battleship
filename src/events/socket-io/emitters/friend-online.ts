import { Types } from 'mongoose';
import { Server } from 'socket.io';

import { RoomEmitter } from './base/room-emitter';

export interface FriendOnlineData {
    friendId: Types.ObjectId;
}

/**
 * Class that wraps socket.io functionality to generate a "friend-online" event
 * for a specific user.
 * Such event should be listened to by every logged user.
 */
export class FriendOnlineEmitter extends RoomEmitter<FriendOnlineData> {
    /**
     * @param ioServer Socket.io server instance
     * @param userId id of the user that has to be notified
     */
    public constructor(ioServer: Server, userId: Types.ObjectId) {
        const eventName: string = 'friend-online';

        super(ioServer, eventName, userId.toString());
    }
}
