import { Socket } from 'socket.io';
import { ClientListener } from './base/client-listener';

interface MatchJoinData {
    matchId: string;
}

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'match-joined' client event.
 * Such event allows the client to join and leave a Socket.io room for some
 * specific match, so that he can listen only to socket-io-events of such match.
 */
export class MatchJoinedListener extends ClientListener<MatchJoinData> {
    constructor(client: Socket) {
        super(client, 'match-joined');
    }

    public listen(): void {
        super.listen((joinData: MatchJoinData): Promise<void> => {
            this.client.join(joinData.matchId);

            this.client.on('match-left', (joinData: MatchJoinData) => {
                this.client.leave(joinData.matchId);
            });

            return Promise.resolve();
        });
    }
}
