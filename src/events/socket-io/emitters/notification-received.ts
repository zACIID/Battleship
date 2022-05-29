import { Types } from 'mongoose';
import { Server } from 'socket.io';

import { RoomEmitter } from './base/room-emitter';

interface Notification {
    /**
     * Id of the user that generated the notification
     */
    sender: string;

    /**
     * Type of the notification
     */
    type: string;
}

/**
 * Class that wraps socket.io functionality to generate a "notification-received" event
 * for a specific user.
 * Such event should be listened to by every logged user.
 */
export class NotificationReceivedEmitter extends RoomEmitter<Notification> {
    /**
     * @param ioServer Socket.io server instance
     * @param userId id of the user that has to be notified
     */
    public constructor(ioServer: Server, userId: Types.ObjectId) {
        const eventName: string = 'notification-received';

        super(ioServer, eventName, userId.toString());
    }
}
