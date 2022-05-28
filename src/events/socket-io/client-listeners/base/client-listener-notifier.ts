import { Server, Socket } from 'socket.io';

import { ClientListener } from "./client-listener";
import { Emitter } from "../../emitters/base/emitter";

/**
 * Abstract class that wraps functionality used to listen
 * to client-emitted Socket.io events and respond to
 * them by emitting data.
 * @param K
 */
export abstract class ClientListenerNotifier<K, T> extends ClientListener<K> {
    public readonly ioServer: Server;

    protected constructor(ioClient: Socket, eventName: string, ioServer: Server) {
        super(ioClient, eventName);

        this.ioServer = ioServer;
    }

    /**
     * Listens for a client event and, when that event is raised,
     * emits data based on what was received by the client.
     *
     * @param emitterProvider function invoked to build the emitter
     * @param emitDataProvider function invoked to build the data to emit
     * @protected
     */
    protected listenAndEmit(emitterProvider: (eventData: K) => Emitter<T>,
                            emitDataProvider: (eventData: K) => T): void {
        super.listen((eventData: K) => {
            const emitter: Emitter<T> = emitterProvider(eventData);
            const emitData: T = emitDataProvider(eventData);

            emitter.emit(emitData);
        });
    }
}
