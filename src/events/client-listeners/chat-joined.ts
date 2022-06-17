import { Socket } from 'socket.io';
import chalk from 'chalk';

import { ClientListener } from './base/client-listener';
import { ChatData } from '../../model/events/chat-data';

/**
 * Class that wraps socket.io functionality to listen
 * to a 'chat-joined' client event.
 * Such event allows the client to join a socket.io room for some
 * specific chat, so that he can listen only to messages of such chat.
 */
export class ChatJoinedListener extends ClientListener<ChatData> {
    constructor(client: Socket) {
        super(client, 'chat-joined');
    }

    public listen(): void {
        super.listen((joinData: ChatData): Promise<void> => {
            this.client.join(joinData.chatId);

            console.log(
                chalk.bgGreen(`Client ${this.client.id} joined the chat '${joinData.chatId}'!`)
            );

            return Promise.resolve();
        });
    }
}
