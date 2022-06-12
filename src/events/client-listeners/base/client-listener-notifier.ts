import { Server, Socket } from 'socket.io';
import { ClientListener } from './client-listener';

/**
 * Abstract class that wraps functionality used to listen
 * to client-emitted socket.io events and emit events based
 * on the listened data
 */
export abstract class ClientListenerNotifier<T> extends ClientListener<T> {
    /**
     * Server instance used to send notification to other clients
     */
    public readonly ioServer: Server;

    protected constructor(ioServer: Server, ioClient: Socket, eventName: string) {
        super(ioClient, eventName);

        this.ioServer = ioServer;
    }
}
