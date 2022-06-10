import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';

import { Emitter } from './base/emitter';
import { ChatData } from '../../model/events/chat-data';

/**
 * Class that wraps socket.io functionality to generate a "chat-joined" event.
 * This allows the client to listen for events about a specific chat,
 * i.e. listening to messages of the chat he joined.
 */
@Injectable({
    providedIn: 'root',
})
export class ChatJoinedEmitter extends Emitter<ChatData> {
    public constructor(client: Socket) {
        super(client, `chat-joined`);
    }
}
