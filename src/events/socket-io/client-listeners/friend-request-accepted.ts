import { Socket } from 'socket.io';
import { ClientListener } from './base/client-listener';
import { RequestNotification } from '../../../models/user/notification';

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'friend-request-accepted' client event.
 * Such event happens when a user accepts a friend request.
 * The user that sent the request is then notified that his new friend
 * is online and has done so.
 */
export class FriendRequestAcceptedListener extends ClientListener {
    constructor(client: Socket) {
        super(client, 'friend-request-accepted');
    }

    listen() {
        super.listen((requestData: RequestNotification) => {
            // TODO se Friend, allora notificare che amico è online
            xxx;
        });
    }
}
