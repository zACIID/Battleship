import { Socket } from 'socket.io';
import chalk from 'chalk';

import { ClientListener } from './base/client-listener';
import { MatchData } from '../../model/events/match-data';

/**
 * Class that wraps socket.io functionality to listen
 * to a 'match-joined' client event.
 * Such event allows the client to join a socket.io room for some
 * specific match, so that he can listen only to events of such match.
 */
export class MatchJoinedListener extends ClientListener<MatchData> {
    constructor(client: Socket) {
        super(client, 'match-joined');
    }

    public listen(): void {
        super.listen((joinData: MatchData): Promise<void> => {
            this.client.join(joinData.matchId);

            console.log(
                chalk.bgGreen(`Client ${this.client.id} joined the match '${joinData.matchId}'!`)
            );

            return Promise.resolve();
        });
    }
}
