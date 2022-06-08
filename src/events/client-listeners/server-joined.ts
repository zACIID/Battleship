import { Socket } from 'socket.io';
import { Types } from 'mongoose';

import { ClientListener } from './base/client-listener';
import { UserData } from '../../model/events/user-data';
import { getUserById, UserDocument } from '../../model/user/user';
import { on } from 'cluster';

/**
 * Class that wraps Socket.io functionality to listen to a 'server-joined' client event.
 * Such event creates a room for the client based on the
 * userId that the login has been made with, which allows the server
 * to send events specifically to the user.
 * This listener also handles the online status change of the user, setting it online
 * after join and online after it disconnects.
 */
export class ServerJoinedListener extends ClientListener<UserData> {
    constructor(client: Socket) {
        super(client, 'server-joined');
    }

    public listen() {
        super.listen(async (joinData: UserData): Promise<void> => {
            this.client.join(joinData.userId);

            // Set user online since it just joined the server
            await ServerJoinedListener.setUserOnline(joinData.userId);

            // Add disconnect listener to set the user offline when he leaves the server
            this.client.on('disconnect', async () => {
                await ServerJoinedListener.setUserOffline(joinData.userId);
            });

            return Promise.resolve();
        });
    }

    /**
     * Set the online status of the provided user to true
     * @param userId id of user to set online
     * @private
     */
    private static async setUserOnline(userId: string): Promise<void> {
        await ServerJoinedListener.setUserOnlineStatus(userId, true);
    }

    /**
     * Set the online status of the provided user to false
     * @param userId id of the user to set offline
     * @private
     */
    private static async setUserOffline(userId: string): Promise<void> {
        await ServerJoinedListener.setUserOnlineStatus(userId, false);
    }

    private static async setUserOnlineStatus(userId: string, online: boolean): Promise<void> {
        const user: UserDocument = await getUserById(Types.ObjectId(userId));
        user.online = online;

        await user.save();
    }
}
