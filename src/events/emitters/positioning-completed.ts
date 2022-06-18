import { Types } from 'mongoose';
import { Server } from 'socket.io';

import { RoomEmitter } from './base/room-emitter';
import { GenericMessage } from '../../model/events/generic-message';
import { setUserStatus, UserStatus } from '../../model/database/user/user';
import { getMatchById, MatchDocument } from '../../model/database/match/match';

/**
 * Class that wraps socket.io functionality to generate a "positioning-completed" event
 * for a specific player.
 * Such event should be listened to by all the players and spectators of a given match.
 */
export class PositioningCompletedEmitter extends RoomEmitter<GenericMessage> {
    private readonly matchId: Types.ObjectId;

    /**
     * @param ioServer socket.io server instance
     * @param matchId id of the match whose players and spectators have to be notified
     */
    public constructor(ioServer: Server, matchId: Types.ObjectId) {
        const eventName: string = 'positioning-completed';
        super(ioServer, eventName, matchId.toString());

        this.matchId = matchId;
    }

    /**
     * Signal to all the listeners of the match that the preparation phase is completed
     * and that the game phase is starting.
     * Also sets the status of the players of the match to "InGame", since they
     * are now past the preparation phase
     * @param data a message signaling the end of the preparation phase / the start of the game phase
     */
    public async emit(data: GenericMessage): Promise<void> {
        super.emit(data);

        const currentMatch: MatchDocument = await getMatchById(this.matchId);
        const { player1, player2 } = currentMatch;

        // Update status of player1 and player2
        await setUserStatus(this.ioServer, player1.playerId, UserStatus.InGame);
        await setUserStatus(this.ioServer, player2.playerId, UserStatus.InGame);
    }
}
