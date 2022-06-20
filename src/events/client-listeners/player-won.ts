import { Server, Socket } from 'socket.io';

import { PlayerWonData } from '../../model/events/player-won-data';
import { ClientListenerNotifier } from './base/client-listener-notifier';
import { MatchTerminatedEmitter } from '../emitters/match-terminated';
import { Types } from 'mongoose';
import { MatchTerminatedReason } from '../../model/events/match-terminated-data';
import { getUserById, UserDocument } from '../../model/database/user/user';

/**
 * Class that wraps socket.io functionality to listen
 * to a 'player-won' client event.
 * Such event allows the server to know when a player has won the game,
 * in order to perform the necessary game-ending operations and notify
 * the other player/spectators that the match has ended.
 */
export class PlayerWonListener extends ClientListenerNotifier<PlayerWonData> {
    constructor(client: Socket, ioServer: Server) {
        super(ioServer, client, 'player-won');
    }

    public listen(): void {
        super.listen(async (eventData: PlayerWonData): Promise<void> => {
            const matchTerminatedNotifier: MatchTerminatedEmitter = new MatchTerminatedEmitter(
                this.ioServer,
                Types.ObjectId(eventData.matchId)
            );

            const winner: UserDocument = await getUserById(Types.ObjectId(eventData.winnerId));
            await matchTerminatedNotifier.emit({
                winnerUsername: winner.username,
                reason: MatchTerminatedReason.PlayerWon,
            });
        });
    }
}
