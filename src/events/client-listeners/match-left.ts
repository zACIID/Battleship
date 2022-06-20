import { Server, Socket } from 'socket.io';
import chalk from 'chalk';

import { MatchLeftData } from '../../model/events/match-left-data';
import { setUserStatus, UserStatus } from '../../model/database/user/user';
import { ioServer } from '../../index';
import { Types } from 'mongoose';
import { MatchTerminatedEmitter } from '../emitters/match-terminated';
import { ClientListenerNotifier } from './base/client-listener-notifier';

/**
 * Class that wraps socket.io functionality to listen
 * to a 'match-left' client event.
 * Such event allows the client to leave a socket.io room for some
 * specific match, so that he can stop listening to the events of such match.
 */
export class MatchLeftListener extends ClientListenerNotifier<MatchLeftData> {
    constructor(client: Socket, ioServer: Server) {
        super(ioServer, client, 'match-left');
    }

    public listen(): void {
        super.listen(async (leaveData: MatchLeftData): Promise<void> => {
            const { matchId, userId } = leaveData;
            this.client.leave(matchId);

            console.log(chalk.red.bold(`Client ${this.client.id} left the match '${matchId}'!`));

            // The user left the match, so its status is now Online
            // and not match-related anymore
            await setUserStatus(ioServer, Types.ObjectId(userId), UserStatus.Online);

            // Leave the match for the user
            const matchTerminated: MatchTerminatedEmitter = new MatchTerminatedEmitter(
                this.ioServer,
                Types.ObjectId(matchId)
            );
            await matchTerminated.terminateOnPlayerLeft(Types.ObjectId(userId));
        });
    }
}
