import { Socket } from 'socket.io-client';

/**
 * Abstract class that wraps functionality used to listen
 * to server-emitted Socket.io
 */
export abstract class ServerListener<T> {
    public readonly client: Socket;
    public readonly eventName: string;

    protected constructor(client: Socket, eventName: string) {
        this.client = client;
        this.eventName = eventName;
    }

    public listen(onEvent: (eventData: T) => Promise<void>): void {
        this.client.on(this.eventName, onEvent);
    }

    public unListen(): void {
        this.client.removeAllListeners(this.eventName);
    }
}
