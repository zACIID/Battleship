import { Server, Socket } from 'socket.io';
import chalk from 'chalk';

import { UserData } from '../../model/events/user-data';
import { getUserById, setUserStatus, UserDocument, UserStatus } from '../../model/user/user';
import { ClientListenerNotifier } from './base/client-listener-notifier';
import { Types } from 'mongoose';
import { MatchTerminatedEmitter } from '../emitters/match-terminated';
import { getCurrentMatch, MatchDocument } from '../../model/match/match';
import { MatchTerminatedReason } from '../../model/events/match-terminated-data';
import { removeMatchmakingEntry } from '../../model/matchmaking/queue-entry';

/**
 * Class that wraps socket.io functionality to listen to a 'server-joined' client event.
 * Such event creates a room for the client based on the
 * userId that the login has been made with, which allows the server
 * to send events specifically to the user.
 *
 * This listener also handles "teardown" operations for the user,
 * such as setting its status to offline, removing it from the matchmaking queue
 * and making it leave any match he is currently playing.
 */
export class ServerJoinedListener extends ClientListenerNotifier<UserData> {
    constructor(client: Socket, ioServer: Server) {
        super(ioServer, client, 'server-joined');
    }

    public listen(): void {
        super.listen(async (joinData: UserData): Promise<void> => {
            this.client.join(joinData.userId);

            console.log(chalk.bgGreen(`User ${joinData.userId} joined the server!`));

            // Add disconnect listener that performs teardown operations on the
            // user when he leaves the server (such as setting its status to Offline)
            this.client.on('disconnect', async () => {
                console.log(chalk.bgRed(`User ${joinData.userId} disconnected from the server!`));

                await this.userTeardown(joinData.userId);
            });

            return Promise.resolve();
        });
    }

    /**
     * Execute teardown of the user, which consists in all those operations
     * that must be performed after the user leaves the server.
     * Notably, such operations are the following:
     *  - set the user status to Offline
     *  - leave any match that the user is currently in
     *  - remove the user from the matchmaking queue
     *
     * @param userId id of the user to teardown
     * @private
     */
    private async userTeardown(userId: string): Promise<void> {
        try {
            await this.leaveCurrentMatchIfAny(userId);
            await ServerJoinedListener.leaveMatchmakingQueueIfEnqueued(userId);

            // It is important to set the status to Offline only at the end, since
            // status contains information about what the user is currently doing.
            // Overwriting it with Offline would mean losing that information.
            await setUserStatus(this.ioServer, Types.ObjectId(userId), UserStatus.Offline);
        } catch (err) {
            console.log(
                chalk.bgRed(`User teardown on disconnect has failed. Reason: ${err.message}`)
            );
        }
    }

    private async leaveCurrentMatchIfAny(userId: string): Promise<void> {
        const userObjId: Types.ObjectId = Types.ObjectId(userId);
        const user: UserDocument = await getUserById(userObjId);

        if (user.status === UserStatus.InGame || user.status === UserStatus.PrepPhase) {
            const currentMatch: MatchDocument = await getCurrentMatch(userObjId);

            const matchTerminated: MatchTerminatedEmitter = new MatchTerminatedEmitter(
                this.ioServer,
                currentMatch._id
            );
            matchTerminated.emit({
                reason: MatchTerminatedReason.PlayerLeftTheGame,
            });
        }
    }

    private static async leaveMatchmakingQueueIfEnqueued(userId: string) {
        const userObjId: Types.ObjectId = Types.ObjectId(userId);
        const user: UserDocument = await getUserById(userObjId);

        if (user.status === UserStatus.InQueue) {
            await removeMatchmakingEntry(userObjId);
        }
    }
}
