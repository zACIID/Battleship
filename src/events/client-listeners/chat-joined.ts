import { Socket } from 'socket.io';

import { ClientListener } from './base/client-listener';
import { ChatData } from '../../model/events/chat-data';

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'chat-joined' client event.
 * Such event allows the client to join a Socket.io room for some
 * specific chat, so that he can listen only to messages of such chat.
 */
export class ChatJoinedListener extends ClientListener<ChatData> {
    constructor(client: Socket) {
        super(client, 'chat-joined');
    }

    public listen() {
        super.listen((joinData: ChatData): Promise<void> => {
            this.client.join(joinData.chatId);

            return Promise.resolve();
        });
    }
}
