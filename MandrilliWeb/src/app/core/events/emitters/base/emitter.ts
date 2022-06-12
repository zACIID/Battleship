import { Socket } from 'ngx-socket-io';

/**
 * Abstract class that wraps socket.io emitter functionality
 * for server-emitted events
 */
export abstract class Emitter<T> {
    public readonly client: Socket;
    public readonly eventName: string;

    protected constructor(client: Socket, eventName: string) {
        this.client = client;
        this.eventName = eventName;
    }

    public emit(data?: T) {
        this.client.emit(this.eventName, data);
    }
}
