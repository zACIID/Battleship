import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';

import { Emitter } from './base/emitter';

export interface ChatJoinData {
    chatId: string;
}

/**
 * Class that wraps socket.io functionality to generate a "chat-joined" event.
 * This allows the client to listen for events about a specific chat,
 * i.e. listening to messages of the chat he joined.
 */
Injectable({
    providedIn: "root"
})
export class ChatJoinedEmitter extends Emitter<ChatJoinData> {
    public constructor(client: Socket) {
        super(client, `chat-joined`);
    }
}
