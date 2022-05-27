import { Server } from 'socket.io';

import { Emitter } from './emitter';

/**
 * Abstract class that wraps Socket.io emitter functionality
 * for server-emitted events to a specific set of clients.
 */
export class RoomEmitter extends Emitter {
    /**
     * Name of the room that this instance emits to
     */
    roomName: string;

    constructor(ioServer: Server, eventName: string, roomName: string) {
        super(ioServer, eventName);

        this.roomName = roomName;
    }

    /**
     * Emit data only on the room specified at initialization
     * @param data
     */
    emit(data: any) {
        this.ioServer.to(this.roomName).emit(this.eventName, data);
    }
}
