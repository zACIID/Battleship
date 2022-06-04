import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { ServerListener } from './base/server-listener';

export interface MatchFoundEventData {
    matchId: string;
}

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'chat-joined' client event.
 * Such event allows the client to join a Socket.io room for some
 * specific chat, so that he can listen only to messages of such chat.
 */
Injectable({
    providedIn: "root"
})
export class MatchFoundListener extends ServerListener<MatchFoundEventData> {
    constructor(client: Socket) {
        super(client, 'match-found');
    }
}
