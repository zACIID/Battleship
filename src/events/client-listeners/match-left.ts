import { Socket } from 'socket.io';

import { ClientListener } from './base/client-listener';
import { MatchData } from '../../model/events/match-data';

/**
 * Class that wraps socket.io functionality to listen
 * to a 'match-joined' client event.
 * Such event allows the client to leave a socket.io room for some
 * specific match, so that he can stop listening to the events of such match.
 */
export class MatchLeftListener extends ClientListener<MatchData> {
    constructor(client: Socket) {
        super(client, 'match-left');
    }

    public listen(): void {
        super.listen((joinData: MatchData): Promise<void> => {
            this.client.leave(joinData.matchId);

            return Promise.resolve();
        });
    }
}
