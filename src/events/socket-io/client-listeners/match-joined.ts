import { Socket } from 'socket.io';
import { ClientListener } from './base/client-listener';

interface MatchJoinData {
    matchId: string;
}

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'match-joined' client event.
 * Such event allows the client to join and leave a Socket.io room for some
 * specific match, so that he can listen only to events of such match.
 */
export class MatchJoinedListener extends ClientListener {
    constructor(client: Socket) {
        super(client, 'match-joined');
    }

    listen() {
        super.listen((joinData: MatchJoinData) => {
            this.client.join(joinData.matchId);

            this.client.on('match-left', (joinData: MatchJoinData) => {
                this.client.leave(joinData.matchId);
            });
        });
    }
}
