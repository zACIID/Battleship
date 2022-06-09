import { Types } from 'mongoose';
import { Server } from 'socket.io';

import { RoomEmitter } from './base/room-emitter';
import { ShotData } from '../../model/events/shot-data';

/**
 * Class that wraps socket.io functionality to generate a "shot-fired" event.
 * Such event should be listened to by all the players and spectators of a given match.
 */
export class ShotFiredEmitter extends RoomEmitter<ShotData> {
    /**
     * @param ioServer Socket.io server instance
     * @param matchId id of the match whose players and spectators have to be notified
     */
    public constructor(ioServer: Server, matchId: Types.ObjectId) {
        const eventName: string = 'shot-fired';

        super(ioServer, eventName, matchId.toString());
    }
}
