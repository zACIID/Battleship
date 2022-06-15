import { Server, Socket } from 'socket.io';
import chalk from 'chalk';

import { UserData } from '../../model/events/user-data';
import { setUserOffline } from '../../model/user/user';
import { ClientListenerNotifier } from './base/client-listener-notifier';

/**
 * Class that wraps socket.io functionality to listen to a 'server-joined' client event.
 * Such event creates a room for the client based on the
 * userId that the login has been made with, which allows the server
 * to send events specifically to the user.
 * This listener also handles "teardown" operations such as setting it offline
 * and sending match-left events when the user's client disconnects from the system.
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
     * that must be performed after the user leaves the server
     * (e.g. set offline, leave match, etc.)
     * @param userId id of the user to teardown
     * @private
     */
    private async userTeardown(userId: string): Promise<void> {
        // TODO check if he has to leave a match and, if yes, notify match-terminated
        //  this needs a function like findMatchForUser(userId) in order to get the
        //  match that the user is in. Such function should return the latest match
        //  where one of the players is the user.

        await setUserOffline(this.ioServer, userId);
    }
}
