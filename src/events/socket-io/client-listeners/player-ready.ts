import { Server, Socket } from "socket.io";
import { Types } from "mongoose";

import { MatchDocument, MatchModel } from "../../../models/match/match";
import { ClientListenerNotifier } from "./base/client-listener-notifier";
import { OpponentReadyEmitter } from "../emitters/opponent-ready";
import { GenericMessage } from "../emitters/base/generic-message";

interface PlayerReadyData {
    playerId: Types.ObjectId;
    matchId: Types.ObjectId;
}

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'player-ready' client event.
 * Such event happens when a player has ended his positioning phase.
 * The other player is then notified of this occurrence.
 */
export class PlayerReadyListener extends ClientListenerNotifier<PlayerReadyData, GenericMessage> {
    constructor(client: Socket, ioServer: Server) {
        super(client, 'player-ready', ioServer);
    }

    public async listen(): Promise<void> {
        super.listen(async () => {
            const emitterProvider = async (eventData: PlayerReadyData): Promise<OpponentReadyEmitter> => {
                const match: MatchDocument = await MatchModel.findOne({ _id: eventData.matchId });

                let opponentId: Types.ObjectId = null;
                const player1Id: Types.ObjectId = match.player1.playerId;
                const player2Id: Types.ObjectId = match.player2.playerId;

                // Opponent is the opposite player
                if (player1Id.equals(eventData.playerId)) {
                    opponentId = player2Id;
                } else if (player2Id.equals(eventData.playerId)) {
                    opponentId = player1Id;
                } else {
                    throw new Error(`PlayerId '${eventData.playerId}' not in match`);
                }

                return new OpponentReadyEmitter(this.ioServer, opponentId);
            };
            const emitDataProvider = (eventData: PlayerReadyData): Promise<GenericMessage> => {
                return Promise.resolve({
                    message: `Player ${eventData.playerId} is ready`
                });
            };

            await super.listenAndEmit(emitterProvider, emitDataProvider);
        });
    }
}
