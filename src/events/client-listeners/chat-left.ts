import { Socket } from 'socket.io';

import { ClientListener } from './base/client-listener';
import { Promise } from 'mongoose';
import { ChatData } from '../../model/events/chat-data';

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'chat-left' client event.
 * Such event allows the client to leave a Socket.io room for some
 * specific chat, so that he can stop listening to messages of such chat.
 */
export class ChatLeftListener extends ClientListener<ChatData> {
    constructor(client: Socket) {
        super(client, 'chat-left');
    }

    public listen() {
        super.listen((joinData: ChatData): Promise<void> => {
            this.client.leave(joinData.chatId);

            return Promise.resolve();
        });
    }
}
