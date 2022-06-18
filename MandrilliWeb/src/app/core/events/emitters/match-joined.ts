import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';

import { Emitter } from './base/emitter';
import { MatchJoinedData } from '../../model/events/match-joined-data';

/**
 * Class that wraps socket.io functionality to generate a "match-joined" event.
 * This allows the client to listen for events about a specific match,
 * i.e. shots fired, changes of player state, etc.
 */
@Injectable({
    providedIn: 'root',
})
export class MatchJoinedEmitter extends Emitter<MatchJoinedData> {
    public constructor(client: Socket) {
        super(client, `match-joined`);
    }
}
