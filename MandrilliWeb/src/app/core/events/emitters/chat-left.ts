import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';

import { Emitter } from './base/emitter';

export interface ChatJoinData {
    chatId: string;
}

/**
 * Class that wraps socket.io functionality to generate a "chat-left" event.
 * This allows the client to notify the server that it should stop sending data
 * about events of a specific chat.
 */
Injectable({
    providedIn: "root"
})
export class ChatLeftEmitter extends Emitter<ChatJoinData> {
    public constructor(client: Socket) {
        super(client, `chat-left`);
    }
}
