import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';

import { ClientListenerNotifier } from './base/client-listener-notifier';
import { FriendOnlineEmitter } from '../emitters/friend-online';
import { AcceptedFriendRequestData } from '../../model/events/accepted-friend-request-data';
import { FriendOnlineData } from '../../model/events/friend-online-data';
import { getUserById, UserDocument } from '../../model/user/user';
import { RequestTypes } from '../../model/user/notification';

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'friend-request-accepted' client event.
 * Such event happens when a user accepts a friend request.
 * The user that sent the request is then notified that his new friend
 * is online and has done so.
 */
export class FriendRequestAcceptedListener extends ClientListenerNotifier<
    AcceptedFriendRequestData,
    FriendOnlineData
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
            eventData: AcceptedFriendRequestData
        ): Promise<FriendOnlineEmitter[]> => {
            const emitters = [
                new FriendOnlineEmitter(this.ioServer, Types.ObjectId(eventData.userToNotifyId)),
            ];

            return Promise.resolve(emitters);
        };

        // Add the relationship to both users, remove the now old notification
        // from the user that  received the friend request
        const emitDataProvider = async (
            eventData: AcceptedFriendRequestData
        ): Promise<FriendOnlineData> => {
            await FriendRequestAcceptedListener.createNewRelationship(eventData);
            await FriendRequestAcceptedListener.removeNotification(eventData);

            return Promise.resolve({
                friendId: eventData.friendId,
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
        eventData: AcceptedFriendRequestData
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
    private static async removeNotification(eventData: AcceptedFriendRequestData): Promise<void> {
        const notifiedUserId: Types.ObjectId = Types.ObjectId(eventData.friendId);
        const notifiedUser: UserDocument = await getUserById(notifiedUserId);

        // Friend from the perspective of the notified user
        const friendId: Types.ObjectId = Types.ObjectId(eventData.userToNotifyId);
        await notifiedUser.removeNotification(RequestTypes.FriendRequest, friendId);
    }
}
