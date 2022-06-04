import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';

import { Emitter } from './base/emitter';

export interface MatchJoinData {
    matchId: string;
}

/**
 * Class that wraps socket.io functionality to generate a "match-left" event.
 * This allows the client to notify the server that it should stop sending data
 * about events of a specific match.
 */
Injectable({
    providedIn: "root"
})
export class MatchLeftEmitter extends Emitter<MatchJoinData> {
    public constructor(client: Socket) {
        super(client, `match-left`);
    }
}
