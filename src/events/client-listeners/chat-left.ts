import { Socket } from 'socket.io';
import chalk from 'chalk';

import { ClientListener } from './base/client-listener';
import { Promise } from 'mongoose';
import { ChatData } from '../../model/events/chat-data';

/**
 * Class that wraps socket.io functionality to listen
 * to a 'chat-left' client event.
 * Such event allows the client to leave a socket.io room for some
 * specific chat, so that he can stop listening to messages of such chat.
 */
export class ChatLeftListener extends ClientListener<ChatData> {
    constructor(client: Socket) {
        super(client, 'chat-left');
    }

    public listen(): void {
        super.listen((joinData: ChatData): Promise<void> => {
            this.client.leave(joinData.chatId);

            console.log(
                chalk.bgRed(`Client ${this.client.id} left the chat '${joinData.chatId}'!`)
            );

            return Promise.resolve();
        });
    }
}
