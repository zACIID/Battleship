import { Types } from 'mongoose';
import { Server } from 'socket.io';

import { RoomEmitter } from './base/room-emitter';

/**
 * Class that wraps socket.io functionality to generate an "opponent-ready" event.
 * Such event should be listened by each of the 2 players in a match, so they
 * can be notified when their opponent is ready.
 */
export class OpponentReadyEmitter extends RoomEmitter<Object> {
    /**
     * @param ioServer Socket.io server instance
     * @param playerId id of the user that has to be notified
     */
    public constructor(ioServer: Server, playerId: Types.ObjectId) {
        const eventName: string = `opponent-ready`;

        super(ioServer, eventName, playerId.toString());
    }

    emit(): void {
        // What is sent here is not really important
        super.emit({
            message: "Opponent is ready"
        });
    }
}
