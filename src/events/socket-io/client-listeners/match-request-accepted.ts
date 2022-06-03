import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';

import { ClientListenerNotifier } from './base/client-listener-notifier';
import { MatchData, MatchFoundEmitter } from '../emitters/match-found';
import { createMatch, MatchDocument } from '../../../models/match/match';

/**
 * Interface that represents the data received
 * on a "match-request-accepted" event
 */
interface MatchRequestAcceptedData {
    player1Id: string;
    player2Id: string;
}

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'match-request-accepted' client event.
 * Such event happens when a user accepts a match request.
 * The match is then created between the two users, who are then notified.
 */
export class MatchRequestAcceptedListener extends ClientListenerNotifier<
    MatchRequestAcceptedData,
    MatchData
> {
    /**
     * @param client that raised the event
     * @param ioServer server instance used to send notifications to the client
     */
    constructor(client: Socket, ioServer: Server) {
        super(client, 'match-request-accepted', ioServer);
    }

    public async listen(): Promise<void> {
        // Create two emitters, one for each player,
        // which will send the notification containing the match id to play in
        const emitterProvider = (
            eventData: MatchRequestAcceptedData
        ): Promise<MatchFoundEmitter[]> => {
            const player1Emitter = new MatchFoundEmitter(
                this.ioServer,
                Types.ObjectId(eventData.player1Id)
            );
            const player2Emitter = new MatchFoundEmitter(
                this.ioServer,
                Types.ObjectId(eventData.player2Id)
            );
            const emitters: MatchFoundEmitter[] = [player1Emitter, player2Emitter];

            return Promise.resolve(emitters);
        };

        // Create the match and the data containing the match id
        const emitDataProvider = async (
            eventData: MatchRequestAcceptedData
        ): Promise<MatchData> => {
            const p1Id: Types.ObjectId = Types.ObjectId(eventData.player1Id);
            const p2Id: Types.ObjectId = Types.ObjectId(eventData.player2Id);
            const match: MatchDocument = await createMatch(p1Id, p2Id);

            return Promise.resolve({
                matchId: match._id,
            });
        };

        await super.listenAndEmit(emitterProvider, emitDataProvider);
    }
}
