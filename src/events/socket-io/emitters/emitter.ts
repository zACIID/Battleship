import { Server } from "socket.io";
import { Schema, Types } from "mongoose";


/**
 * Abstract class that wraps Socket.io emitter functionality
 */
export abstract class SocketIoEmitter {
    public readonly ioServer: Server;
    public readonly eventName: string;

    protected constructor(ioServer: Server, eventName: string) {
        this.ioServer = ioServer;
        this.eventName = eventName;
    }

    public emit(data: any) {
        this.ioServer.emit(this.eventName, data);
    }
}
