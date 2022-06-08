import { Socket } from 'socket.io';

import { ClientListener } from './base/client-listener';
import { MatchData } from '../../model/events/match-data';

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'match-joined' client event.
 * Such event allows the client to join a Socket.io room for some
 * specific match, so that he can listen only to events of such match.
 */
export class MatchJoinedListener extends ClientListener<MatchData> {
    constructor(client: Socket) {
        super(client, 'match-joined');
    }

    public listen(): void {
        super.listen((joinData: MatchData): Promise<void> => {
            this.client.join(joinData.matchId);

            return Promise.resolve();
        });
    }
}
