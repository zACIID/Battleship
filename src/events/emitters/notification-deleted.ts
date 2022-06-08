import { Types } from 'mongoose';
import { Server } from 'socket.io';

import { RoomEmitter } from './base/room-emitter';
import { Notification } from '../../model/events/notification';

/**
 * Class that wraps socket.io functionality to generate a "notification-deleted" event
 * for a specific user.
 * Such event should be listened to by every logged user.
 */
export class NotificationDeletedEmitter extends RoomEmitter<Notification> {
    /**
     * @param ioServer Socket.io server instance
     * @param userId id of the user that has to be notified
     */
    public constructor(ioServer: Server, userId: Types.ObjectId) {
        const eventName: string = 'notification-deleted';

        super(ioServer, eventName, userId.toString());
    }
}
