import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';

import { UserData } from '../../model/events/user-data';
import { getUserById, UserDocument, UserStatus } from '../../model/user/user';
import { RelationshipSubDocument } from '../../model/user/relationship';
import { FriendStatusChangedEmitter } from '../emitters/friend-status-changed';
import { ClientListenerNotifier } from './base/client-listener-notifier';

/**
 * Class that wraps socket.io functionality to listen to a 'server-joined' client event.
 * Such event creates a room for the client based on the
 * userId that the login has been made with, which allows the server
 * to send events specifically to the user.
 * This listener also handles sets the user status to online after joining the server,
 * and handles "teardown" operations such as setting it offline
 * and sending match-left events when the user disconnects.
 */
export class ServerJoinedListener extends ClientListenerNotifier<UserData> {
    constructor(client: Socket, ioServer: Server) {
        super(ioServer, client, 'server-joined');
    }

    public listen() {
        super.listen(async (joinData: UserData): Promise<void> => {
            this.client.join(joinData.userId);

            // Set user online since it just joined the server
            await this.setUserOnline(joinData.userId);

            // Add disconnect listener to set the user offline when he leaves the server
            this.client.on('disconnect', async () => {
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

        await this.setUserOffline(userId);
    }

    // TODO move all the below methods to UserSchema.methods?

    /**
     * Set the status of the provided user to offline and notify his friends
     * that his status has changed
     * @param userId id of user to set online
     * @private
     */
    private async setUserOnline(userId: string): Promise<void> {
        const newStatus: UserStatus = UserStatus.Online;

        await this.setUserStatus(userId, newStatus);
    }

    /**
     * Set the status of the provided user to offline and notify his friends
     * that his status has changed
     * @param userId id of the user to set offline
     * @private
     */
    private async setUserOffline(userId: string): Promise<void> {
        const newStatus: UserStatus = UserStatus.Offline;

        await this.setUserStatus(userId, newStatus);
    }

    /**
     * Sets the status of the provided user to the provided value
     * and notifies his friends of the change.
     * @param userId id of the user whose status has to be changed
     * @param newStatus new status of the user
     * @private
     */
    private async setUserStatus(userId: string, newStatus: UserStatus): Promise<void> {
        const user: UserDocument = await getUserById(Types.ObjectId(userId));
        user.status = newStatus;

        await user.save();

        const friendIds: Types.ObjectId[] = user.relationships.map(
            (rel: RelationshipSubDocument) => {
                return rel.friendId;
            }
        );
        await this.notifyFriendsUserStatusChanged(user._id, friendIds, newStatus);
    }

    /**
     * Notify the friends of the user that his status is now offline
     * @param userId id of the user whose friends have to be notified
     * @param friendIds ids of the friends of the user
     * @param newStatus new status of the user
     * @private
     */
    private async notifyFriendsUserStatusChanged(
        userId: Types.ObjectId,
        friendIds: Types.ObjectId[],
        newStatus: UserStatus
    ) {
        // Notify each friend that the user is now offline
        friendIds.forEach((fId: Types.ObjectId) => {
            const notifier: FriendStatusChangedEmitter = new FriendStatusChangedEmitter(
                this.ioServer,
                fId
            );
            notifier.emit({
                status: newStatus,
                friendId: userId.toString(),
            });
        });
    }
}
