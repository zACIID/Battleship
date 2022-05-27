import { Socket } from 'socket.io';

/**
 * Abstract class that wraps functionality used to listen
 * to client-emitted Socket.io events
 */
export abstract class ClientListener {
    public readonly client: Socket;
    public readonly eventName: string;

    protected constructor(ioClient: Socket, eventName: string) {
        this.client = ioClient;
        this.eventName = eventName;
    }

    public listen(callback: (...args: any[]) => void): void {
        this.client.on(this.eventName, callback);
    }

    public unListen(): void {
        this.client.removeAllListeners(this.eventName);
    }
}
