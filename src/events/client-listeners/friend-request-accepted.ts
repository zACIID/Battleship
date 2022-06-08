import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';

import { ClientListenerNotifier } from './base/client-listener-notifier';
import { FriendOnlineEmitter } from '../emitters/friend-online';
import { AcceptedFriendRequest } from '../../model/events/accepted-friend-request-data';
import { FriendOnlineData } from '../../model/events/friend-online-data';

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'friend-request-accepted' client event.
 * Such event happens when a user accepts a friend request.
 * The user that sent the request is then notified that his new friend
 * is online and has done so.
 */
export class FriendRequestAcceptedListener extends ClientListenerNotifier<
    AcceptedFriendRequest,
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
            eventData: AcceptedFriendRequest
        ): Promise<FriendOnlineEmitter[]> => {
            const emitters = [
                new FriendOnlineEmitter(this.ioServer, Types.ObjectId(eventData.userToNotify)),
            ];

            return Promise.resolve(emitters);
        };

        const emitDataProvider = (eventData: AcceptedFriendRequest): Promise<FriendOnlineData> => {
            // TODO add relationship and remove notification done here

            return Promise.resolve({
                friendId: eventData.friendId,
            });
        };

        return super.listenAndEmit(emitterProvider, emitDataProvider);
    }
}
