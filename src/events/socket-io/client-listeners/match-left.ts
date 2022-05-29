import { Socket } from 'socket.io';
import { ClientListener } from './base/client-listener';

interface MatchJoinData {
    matchId: string;
}

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'match-joined' client event.
 * Such event allows the client to leave a Socket.io room for some
 * specific match, so that he can stop listening to the events of such match.
 */
export class MatchLeftListener extends ClientListener<MatchJoinData> {
    constructor(client: Socket) {
        super(client, 'match-left');
    }

    public listen(): void {
        super.listen((joinData: MatchJoinData): Promise<void> => {
            this.client.leave(joinData.matchId);

            return Promise.resolve();
        });
    }
}
