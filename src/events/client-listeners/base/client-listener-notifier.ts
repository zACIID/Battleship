import { Server, Socket } from 'socket.io';

import { ClientListener } from './client-listener';
import { Emitter } from '../../emitters/base/emitter';

/**
 * Abstract class that wraps functionality used to listen
 * to client-emitted Socket.io events and respond to
 * them by emitting data.
 *
 * @param L type of the data that is received when listening to the event
 * @param N type of the data that is sent by the notifier
 */
// TODO questa classe non mi piace perché è scomoda. Meglio far ereditare da un listener normale
export abstract class ClientListenerNotifier<L, N> extends ClientListener<L> {
    public readonly ioServer: Server;

    protected constructor(ioClient: Socket, eventName: string, ioServer: Server) {
        super(ioClient, eventName);

        this.ioServer = ioServer;
    }

    /**
     * Listens for a client event and, when that event is raised,
     * emits data based on what was received by the client.
     * Such data may be sent by one or more emitters, which are created
     * by the provided function
     *
     * @param emitterProvider function invoked to build the emitter
     * @param emitDataProvider function invoked to build the data to emit
     * @protected
     */
    protected async listenAndEmit(
        emitterProvider: (eventData: L) => Promise<Emitter<N>[]>,
        emitDataProvider: (eventData: L) => Promise<N>
    ): Promise<void> {
        super.listen(async (eventData: L) => {
            const emitters: Emitter<N>[] = await emitterProvider(eventData);
            const emitData: N = await emitDataProvider(eventData);

            emitters.forEach((e) => {
                e.emit(emitData);
            });
        });
    }
}
