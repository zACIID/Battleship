import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';

import { ClientListenerNotifier } from './base/client-listener-notifier';
import { FriendOnlineData, FriendOnlineEmitter } from '../emitters/friend-online';
import * as process from 'process';

interface AcceptedFriendRequestData {
    userToNotify: Types.ObjectId;
    friendId: Types.ObjectId;
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
        ): Promise<FriendOnlineEmitter> => {
            return Promise.resolve(new FriendOnlineEmitter(this.ioServer, eventData.userToNotify));
        };
        const emitDataProvider = (
            eventData: AcceptedFriendRequestData
        ): Promise<FriendOnlineData> => {
            return Promise.resolve({
                friendId: eventData.friendId,
            });
        };

        return super.listenAndEmit(emitterProvider, emitDataProvider);
    }
}
