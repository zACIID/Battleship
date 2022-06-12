import { Server } from 'socket.io';
import { Schema, Types } from 'mongoose';

/**
 * Abstract class that wraps socket.io emitter functionality
 * for server-emitted events
 */
export abstract class Emitter<T> {
    public readonly ioServer: Server;
    public readonly eventName: string;

    protected constructor(ioServer: Server, eventName: string) {
        this.ioServer = ioServer;
        this.eventName = eventName;
    }

    public emit(data?: T) {
        this.ioServer.emit(this.eventName, data);
    }
}
