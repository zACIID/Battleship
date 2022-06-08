import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { ServerListener } from './base/server-listener';
import { ApiMessage } from '../../model/api/chat/api-message';

interface ChatMessageEventData extends ApiMessage {}

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'chat-message' server event.
 * Such event allows the user to be notified when new messages
 * are written to the chat(s) he is active in.
 */
Injectable({
    providedIn: 'root',
});
export class ChatMessageListener extends ServerListener<ChatMessageEventData> {
    constructor(client: Socket) {
        super(client, 'chat-message');
    }
}
