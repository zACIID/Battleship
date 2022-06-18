import { Socket } from 'socket.io';
import chalk from 'chalk';

import { ClientListener } from './base/client-listener';
import { MatchLeftData } from '../../model/events/match-left-data';
import { setUserStatus, UserStatus } from '../../model/user/user';
import { ioServer } from '../../index';
import { Types } from 'mongoose';

/**
 * Class that wraps socket.io functionality to listen
 * to a 'match-left' client event.
 * Such event allows the client to leave a socket.io room for some
 * specific match, so that he can stop listening to the events of such match.
 */
export class MatchLeftListener extends ClientListener<MatchLeftData> {
    constructor(client: Socket) {
        super(client, 'match-left');
    }

    public listen(): void {
        super.listen(async (leaveData: MatchLeftData): Promise<void> => {
            this.client.leave(leaveData.matchId);

            console.log(
                chalk.bgRed(`Client ${this.client.id} left the match '${leaveData.matchId}'!`)
            );

            // The user left the match, so its status is now Online
            // and not match-related anymore
            await setUserStatus(ioServer, Types.ObjectId(leaveData.userId), UserStatus.Online);
        });
    }
}
