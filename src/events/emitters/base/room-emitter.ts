import { Server } from 'socket.io';

import { Emitter } from './emitter';

/**
 * Abstract class that wraps socket.io emitter functionality
 * for server-emitted events to a specific set of clients.
 */
export class RoomEmitter<T> extends Emitter<T> {
    /**
     * Name of the room that this instance emits to
     */
    public readonly roomName: string;

    constructor(ioServer: Server, eventName: string, roomName: string) {
        super(ioServer, eventName);

        this.roomName = roomName;
    }

    /**
     * Emit data only on the room specified at initialization
     * @param data
     */
    public emit(data: T) {
        this.ioServer.to(this.roomName).emit(this.eventName, data);
    }
}
