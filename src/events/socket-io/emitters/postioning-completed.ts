import { Types } from 'mongoose';
import { Server } from 'socket.io';

import { RoomEmitter } from './base/room-emitter';

/**
 * Class that wraps socket.io functionality to generate a "positioning-completed" event
 * for a specific player.
 * Such event should be listened to by a player that is looking to join a match.
 */
export class PositioningCompletedEmitter extends RoomEmitter {
    /**
     * @param ioServer Socket.io server instance
     * @param matchId id of the match whose players and spectators have to be notified
     */
    public constructor(ioServer: Server, matchId: Types.ObjectId) {
        const eventName: string = 'positioning-completed';

        super(ioServer, eventName, matchId.toString());
    }

    emit(): void {
        // What is sent here is not important, it could be anything
        super.emit('positioning completed');
    }
}
