import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';

import { Emitter } from './base/emitter';

export interface MatchJoinData {
    matchId: string;
}

/**
 * Class that wraps socket.io functionality to generate a "match-joined" event.
 * This allows the client to listen for events about a specific match,
 * i.e. shots fired, changes of player state, etc.
 */
Injectable({
    providedIn: "root"
})
export class MatchJoinedEmitter extends Emitter<MatchJoinData> {
    public constructor(client: Socket) {
        super(client, `match-joined`);
    }
}
