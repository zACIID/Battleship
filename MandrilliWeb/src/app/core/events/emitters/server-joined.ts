import { Socket } from 'ngx-socket-io';
import { Emitter } from './base/emitter';
import { Injectable } from '@angular/core';

export interface ChatJoinData {
    chatId: string;
}

/**
 * Class that wraps socket.io functionality to generate a "server-joined" event.
 * This allows the client to register itself to the socket.io server, so that
 * it can receive data specifically sent to the currently logged user.
 */
Injectable({
    providedIn: "root"
})
export class ServerJoinedEmitter extends Emitter<ChatJoinData> {
    public constructor(client: Socket) {
        super(client, `server-joined`);
    }
}
