import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { ServerListener } from './base/server-listener';
import { ApiMessage } from '../../model/api/chat/api-message';

interface ChatMessageEventData extends ApiMessage {}

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'chat-message' client event.
 * Such event allows the client to TODO
 */
Injectable({
    providedIn: 'root',
});
export class ChatMessageListener extends ServerListener<ChatMessageEventData> {
    constructor(client: Socket) {
        super(client, 'chat-message');
    }
}
