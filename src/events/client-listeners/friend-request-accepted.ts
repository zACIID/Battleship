import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';

import { FriendStatusChangedEmitter } from '../emitters/friend-status-changed';
import { FriendStatusChangedData } from '../../model/events/friend-status-changed-data';
import { getUserById, UserDocument, UserStatus } from '../../model/user/user';
import { RequestTypes } from '../../model/user/notification';
import { ClientListenerNotifier } from './base/client-listener-notifier';
import { RequestAcceptedData } from '../../model/events/request-accepted-data';

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'friend-request-accepted' client event.
 * Such event happens when a user accepts a friend request.
 * The user that sent the request is then notified that his new friend
 * is online.
 */
export class FriendRequestAcceptedListener extends ClientListenerNotifier<RequestAcceptedData> {
    /**
     * @param client that raised the event
     * @param ioServer server instance used to send notifications to the client
     */
    constructor(client: Socket, ioServer: Server) {
        super(ioServer, client, 'friend-request-accepted');
    }

    public listen(): void {
        super.listen(async (eventData: RequestAcceptedData): Promise<void> => {
            // Add the relationship to both users, remove the now old notification
            // from the user that  received the friend request
            await FriendRequestAcceptedListener.createNewRelationship(eventData);
            await FriendRequestAcceptedListener.removeNotification(eventData);

            // Notify the new friend about the accepted request and
            // the fact that a new friend is online
            this.notifyNewFriend(eventData);
        });
    }

    /**
     * Add a relationship to both users involved in the friend request
     * @param eventData
     * @private
     */
    private static async createNewRelationship(eventData: RequestAcceptedData): Promise<void> {
        const sender: UserDocument = await getUserById(Types.ObjectId(eventData.senderId));
        await sender.addRelationshipSymmetrically(Types.ObjectId(eventData.receiverId));
    }

    /**
     * Remove the notification from the notified user (the friend that accepted the request)
     * @param eventData
     * @private
     */
    private static async removeNotification(eventData: RequestAcceptedData): Promise<void> {
        const receiverId: Types.ObjectId = Types.ObjectId(eventData.receiverId);
        const notifiedUser: UserDocument = await getUserById(receiverId);

        // Friend from the perspective of the notified user
        const senderId: Types.ObjectId = Types.ObjectId(eventData.senderId);
        await notifiedUser.removeNotification(RequestTypes.FriendRequest, senderId);
    }

    /**
     * Notifies the sender of the friend request that the latter has been accepted
     * and that the has a new online friend
     * @param eventData
     * @private
     */
    private notifyNewFriend(eventData: RequestAcceptedData): void {
        const senderNotifier: FriendStatusChangedEmitter = new FriendStatusChangedEmitter(
            this.ioServer,
            Types.ObjectId(eventData.senderId)
        );
        const statusChangedData: FriendStatusChangedData = {
            friendId: eventData.receiverId,
            status: UserStatus.Online,
        };

        senderNotifier.emit(statusChangedData);
    }
}
