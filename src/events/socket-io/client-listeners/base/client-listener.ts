import { Socket } from 'socket.io';

/**
 * Abstract class that wraps functionality used to listen
 * to client-emitted Socket.io socket-io-events
 */
export abstract class ClientListener<T> {
    public readonly client: Socket;
    public readonly eventName: string;

    protected constructor(ioClient: Socket, eventName: string) {
        this.client = ioClient;
        this.eventName = eventName;
    }

    protected listen(onEvent: (eventData: T) => Promise<void>): void {
        this.client.on(this.eventName, onEvent);
    }

    public unListen(): void {
        this.client.removeAllListeners(this.eventName);
    }
}
