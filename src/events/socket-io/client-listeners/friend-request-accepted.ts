import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';

import { ClientListenerNotifier } from './base/client-listener-notifier';
import { FriendOnlineData, FriendOnlineEmitter } from '../emitters/friend-online';

/**
 * Interface representing the data coming from a
 * "friend-request-accepted" event
 */
interface AcceptedFriendRequestData {
    userToNotify: string;
    friendId: string;
}

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
                new FriendOnlineEmitter(this.ioServer, Types.ObjectId(eventData.userToNotify)),
            ];

            return Promise.resolve(emitters);
        };

        const emitDataProvider = (
            eventData: AcceptedFriendRequestData
        ): Promise<FriendOnlineData> => {
            // TODO add relationship and remove notification done here

            return Promise.resolve({
                friendId: Types.ObjectId(eventData.friendId),
            });
        };

        return super.listenAndEmit(emitterProvider, emitDataProvider);
    }
}
