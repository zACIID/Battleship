import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { ServerListener } from './base/server-listener';
import { ChatMessage } from '../../model/events/chat-message';

/**
 * Class that wraps socket.io functionality to listen
 * to a 'chat-message' server event.
 * Such event allows the user to be notified when new messages
 * are written to the chat(s) he is active in.
 */
@Injectable({
    providedIn: 'root',
})
export class ChatMessageListener extends ServerListener<ChatMessage> {
    constructor(client: Socket) {
        super(client, 'chat-message');
    }
}
