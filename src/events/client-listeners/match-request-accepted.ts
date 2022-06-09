import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';

import { ClientListenerNotifier } from './base/client-listener-notifier';
import { MatchFoundEmitter } from '../emitters/match-found';
import { createMatch, MatchDocument } from '../../model/match/match';
import { MatchData } from '../../model/events/match-data';
import { MatchRequestAcceptedData } from '../../model/events/match-request-accepted-data';

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
            // TODO check that both clients are listening for this event
            //  else a match could be created between two players where
            //  the one that sent the request isn't listening
            // TODO 2: do something to notify the user that the match couldn't be created?
            //  in this case an error message is sent

            // TODO qui è da capire come fare. Mi verrebbe da dire che se
            //  user è offline oppure online ma inGame allora pacco,
            //  altrimenti si fa. Il problema è che non c'è una scadenza per la richiesta,
            //  però vabbè, quella è una feature su cui ragionare. In effetti non c'è neanche
            //  una lista di richieste pending, dunque il concetto di richiesta scaduta
            //  richiederebbe una ristrutturazione più profonda. Noi ci accontentiamo.

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

            // TODO remove notification

            return Promise.resolve({
                matchId: match._id,
            });
        };

        await super.listenAndEmit(emitterProvider, emitDataProvider);
    }
}
