import { Types } from 'mongoose';
import { Server } from 'socket.io';

import { RoomEmitter } from './base/room-emitter';
import { GridCoordinates } from '../../../models/match/state/grid-coordinates';

interface ShipsUpdate {
    playerId: string;
    ships: Ship[];
}

interface Ship {
    coordinates: GridCoordinates[];
    type: string;
}

/**
 * Class that wraps socket.io functionality to generate an "player-ships-updated" event
 * for a specific player.
 * Such event should be listened to by both players of a match to know when the opponent has
 * updated the position of his ships on the grid.
 */
export class PlayerShipsUpdatedEmitter extends RoomEmitter<ShipsUpdate> {
    /**
     * @param ioServer Socket.io server instance
     * @param matchId id of the match whose players and spectators have to be notified
     */
    public constructor(ioServer: Server, matchId: Types.ObjectId) {
        const eventName: string = 'player-ships-updated';

        super(ioServer, eventName, matchId.toString());
    }
}
