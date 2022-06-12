import { Types } from 'mongoose';
import { Server } from 'socket.io';

import { RoomEmitter } from './base/room-emitter';
import { PlayerStateChangedData } from '../../model/events/player-state-changed-data';

/**
 * Class that wraps socket.io functionality to generate an "opponent-state-changed" event.
 * Such event should be listened by each of the 2 players in a match, so they
 * can be notified when their opponent has completed his positioning phase (is ready/not ready).
 */
export class PlayerStateChangedEmitter extends RoomEmitter<PlayerStateChangedData> {
    /**
     * @param ioServer socket.io server instance
     * @param matchId id of the match whose players and spectators have to be notified
     */
    public constructor(ioServer: Server, matchId: Types.ObjectId) {
        const eventName: string = `opponent-state-changed`;
        super(ioServer, eventName, matchId.toString());
    }
}
