import { Socket } from 'socket.io';

import { ClientListener } from './base/client-listener';
import { UserData } from '../../model/events/user-data';

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'server-joined' client event.
 * Such event creates a room for the client based on the
 * userId that the login has been made with.
 * This allows the server to send events to specific users.
 */
export class ServerJoinedListener extends ClientListener<UserData> {
    constructor(client: Socket) {
        super(client, 'server-joined');
    }

    public listen() {
        super.listen((joinData: UserData): Promise<void> => {
            this.client.join(joinData.userId);

            return Promise.resolve();
        });
    }
}
