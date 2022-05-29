import { Server, Socket } from "socket.io";
import { Types } from "mongoose";

import { ClientListenerNotifier } from "./base/client-listener-notifier";
import { MatchData, MatchFoundEmitter } from "../emitters/match-found";

interface MatchRequestAcceptedData {
    userToNotify: Types.ObjectId;
    matchId: Types.ObjectId;
}

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'match-request-accepted' client event.
 * Such event happens when a user accepts a match request.
 * The match is created between the two users, who are then notified.
 */
export class MatchRequestAcceptedListener extends ClientListenerNotifier<MatchRequestAcceptedData, MatchData> {

    /**
     * @param client that raised the event
     * @param ioServer server instance used to send notifications to the client
     */
    constructor(client: Socket, ioServer: Server) {
        super(client, 'match-request-accepted', ioServer);
    }

    public async listen(): Promise<void> {
        const emitterProvider = (eventData: MatchRequestAcceptedData): Promise<MatchFoundEmitter> => {
            return Promise.resolve(new MatchFoundEmitter(this.ioServer, eventData.userToNotify));
        }
        const emitDataProvider = (eventData: MatchRequestAcceptedData): Promise<MatchData> => {
            return Promise.resolve({
                matchId: eventData.matchId
            });
        };

        await super.listenAndEmit(emitterProvider, emitDataProvider);
    }
}

