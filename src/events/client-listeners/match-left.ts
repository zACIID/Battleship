import { Server, Socket } from 'socket.io';
import chalk from 'chalk';

import { MatchLeftData } from '../../model/events/match-left-data';
import { setUserStatus, UserStatus } from '../../model/database/user/user';
import { ioServer } from '../../index';
import { Types } from 'mongoose';
import { MatchTerminatedEmitter } from '../emitters/match-terminated';
import { ClientListenerNotifier } from './base/client-listener-notifier';
import { isUserSpectator } from '../../model/database/match/match';

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
            try {
                const { matchId, userId } = leaveData;
                const objUserId: Types.ObjectId = Types.ObjectId(userId);
                const objMatchId: Types.ObjectId = Types.ObjectId(matchId);

                this.client.leave(matchId);

                console.log(
                    chalk.red.bold(`Client ${this.client.id} left the match '${matchId}'!`)
                );

                // The user left the match, so its status is now Online
                // and not match-related anymore
                await setUserStatus(ioServer, objUserId, UserStatus.Online);

                const isUserPlayer: boolean = !(await isUserSpectator(objMatchId, objUserId));
                if (isUserPlayer) {
                    // Only if the user is a player, terminate the match
                    const matchTerminated: MatchTerminatedEmitter = new MatchTerminatedEmitter(
                        this.ioServer,
                        objMatchId
                    );
                    await matchTerminated.terminateOnPlayerLeft(Types.ObjectId(userId));
                }
            } catch (err) {
                if (err instanceof Error) {
                    console.log(
                        chalk.bgRed(`An error occurred while trying to leave the match. 
                        Reason: ${err.message}`)
                    );
                }
            }
        });
    }
}
