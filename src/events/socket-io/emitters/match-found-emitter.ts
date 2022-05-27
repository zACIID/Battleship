import { Types } from "mongoose";
import { Server } from "socket.io";

import { SocketIoEmitter } from "./emitter";

export interface MatchFoundNotificationData {
    matchId: Types.ObjectId
}

/**
 * Class that wraps socket.io functionality to generate a "Match Found" event
 * for a specified player
 */
export class MatchFoundEmitter extends SocketIoEmitter {
    public constructor(ioServer: Server, player: Types.ObjectId) {
        const eventName: string = `match-found-${player}`;

        super(ioServer, eventName);
    }


    emit(data: MatchFoundNotificationData): void {
        super.emit(data);
    }
}
