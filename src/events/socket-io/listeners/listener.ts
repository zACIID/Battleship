import { Server } from 'socket.io';
import { Schema, Types } from 'mongoose';

export abstract class SocketIoListener {
    public readonly ioServer: Server;
    public readonly eventName: string;

    protected constructor(ioServer: Server, eventName: string) {
        this.ioServer = ioServer;
        this.eventName = eventName;
    }

    public abstract listen(callback: Function): void;

    public unListen(): void {
        this.ioServer.removeAllListeners(this.eventName);
    }
}
