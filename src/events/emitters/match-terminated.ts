import { Types } from 'mongoose';
import { Server } from 'socket.io';

import { RoomEmitter } from './base/room-emitter';
import { MatchTerminatedData } from '../../model/events/match-terminated-data';

/**
 * Class that wraps socket.io functionality to generate a "match-terminated" event.
 * Such event should be listened by all players and spectators of a match, so they
 * can be notified that the match has ended.
 */
export class MatchTerminatedEmitter extends RoomEmitter<MatchTerminatedData> {
    /**
     * @param ioServer socket.io server instance
     * @param matchId id of the match whose players and spectators have to be notified
     */
    public constructor(ioServer: Server, matchId: Types.ObjectId) {
        const eventName: string = 'match-terminated';
        super(ioServer, eventName, matchId.toString());
    }
}
