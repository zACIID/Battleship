import { Server, Socket } from "socket.io";

import { ClientListenerNotifier } from "./base/client-listener-notifier";
import { FriendOnlineData, FriendOnlineEmitter } from "../emitters/friend-online";
import { OpponentReadyEmitter } from "../emitters/opponent-ready";

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'player-ready' client event.
 * Such event happens when a player has ended his positioning phase.
 * The other player is then notified of this occurrence.
 */
export class PlayerReadyListener extends ClientListenerNotifier<Object, Object> {
    constructor(client: Socket, ioServer: Server) {
        super(client, 'player-ready', ioServer);
    }

    public listen() {
        super.listen(() => {
            const emitterProvider = (eventData: AcceptedFriendRequestData): OpponentReadyEmitter => {
                return new FriendOnlineEmitter(this.ioServer, eventData.userToNotify);
            }
            const emitDataProvider = (eventData: AcceptedFriendRequestData): FriendOnlineData => {
                return {
                    friendId: eventData.friendId
                }
            };

            super.listenAndEmit(emitterProvider, emitDataProvider);
        });
    }
}
