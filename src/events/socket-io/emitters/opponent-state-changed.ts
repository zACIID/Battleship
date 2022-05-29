import { Types } from 'mongoose';
import { Server } from 'socket.io';

import { RoomEmitter } from './base/room-emitter';

interface StateChangedData {
    isReady: boolean
}

/**
 * Class that wraps socket.io functionality to generate an "opponent-state-changed" event.
 * Such event should be listened by each of the 2 players in a match, so they
 * can be notified when their opponent changes his state to ready/not ready.
 */
export class OpponentStateChangedEmitter extends RoomEmitter<StateChangedData> {
    /**
     * True if the player changed his state to ready, false otherwise
     */
    public readonly isReady: boolean;

    /**
     * @param ioServer Socket.io server instance
     * @param playerId id of the user that has to be notified
     * @param isReady true if the player changed his state to ready, false otherwise
     */
    public constructor(ioServer: Server, playerId: Types.ObjectId, isReady: boolean) {
        const eventName: string = `opponent-state-changed`;
        super(ioServer, eventName, playerId.toString());

        this.isReady = isReady;
    }

    emit(): void {
        super.emit({
            isReady: this.isReady
        });
    }
}
