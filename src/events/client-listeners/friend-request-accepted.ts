import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';

import { ClientListenerNotifier } from './base/client-listener-notifier';
import { FriendStatusChangedEmitter } from '../emitters/friend-online';
import { FriendRequestAcceptedData } from '../../model/events/friend-request-accepted-data';
import { FriendStatusChangedData } from '../../model/events/friend-status-changed-data';
import { getUserById, UserDocument, UserStatuses } from '../../model/user/user';
import { RequestTypes } from '../../model/user/notification';

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'friend-request-accepted' client event.
 * Such event happens when a user accepts a friend request.
 * The user that sent the request is then notified that his new friend
 * is online and has done so.
 */
export class FriendRequestAcceptedListener extends ClientListenerNotifier<
    FriendRequestAcceptedData,
    FriendStatusChangedData
> {
    /**
     * @param client that raised the event
     * @param ioServer server instance used to send notifications to the client
     */
    constructor(client: Socket, ioServer: Server) {
        super(client, 'friend-request-accepted', ioServer);
    }

    public listen(): Promise<void> {
        const emitterProvider = (
            eventData: FriendRequestAcceptedData
        ): Promise<FriendStatusChangedEmitter[]> => {
            const emitters = [
                new FriendStatusChangedEmitter(
                    this.ioServer,
                    Types.ObjectId(eventData.userToNotifyId)
                ),
            ];

            return Promise.resolve(emitters);
        };

        // Add the relationship to both users, remove the now old notification
        // from the user that  received the friend request
        const emitDataProvider = async (
            eventData: FriendRequestAcceptedData
        ): Promise<FriendStatusChangedData> => {
            await FriendRequestAcceptedListener.createNewRelationship(eventData);
            await FriendRequestAcceptedListener.removeNotification(eventData);

            return Promise.resolve({
                friendId: eventData.friendId,
                status: UserStatuses.Online,
            });
        };

        return super.listenAndEmit(emitterProvider, emitDataProvider);
    }

    /**
     * Add a relationship to both users involved in the friend request
     * @param eventData
     * @private
     */
    private static async createNewRelationship(
        eventData: FriendRequestAcceptedData
    ): Promise<void> {
        const userToNotify: UserDocument = await getUserById(
            Types.ObjectId(eventData.userToNotifyId)
        );
        await userToNotify.addRelationshipSymmetrically(Types.ObjectId(eventData.friendId));
    }

    /**
     * Remove the notification from the notified user (the friend that accepted the request)
     * @param eventData
     * @private
     */
    private static async removeNotification(eventData: FriendRequestAcceptedData): Promise<void> {
        const notifiedUserId: Types.ObjectId = Types.ObjectId(eventData.friendId);
        const notifiedUser: UserDocument = await getUserById(notifiedUserId);

        // Friend from the perspective of the notified user
        const friendId: Types.ObjectId = Types.ObjectId(eventData.userToNotifyId);
        await notifiedUser.removeNotification(RequestTypes.FriendRequest, friendId);
    }
}
