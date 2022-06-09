import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';

import { Emitter } from './base/emitter';
import { RequestAcceptedData } from '../../model/events/request-accepted-data';

/**
 * Class that wraps socket.io functionality to generate a "match-request-accepted" event.
 * The user notifies the server that he has accepted the request,
 * so that the server can arrange the match and notify the two players
 * about the game that has started.
 */
Injectable({
    providedIn: 'root',
});
export class MatchRequestAcceptedEmitter extends Emitter<RequestAcceptedData> {
    public constructor(client: Socket) {
        super(client, `match-request-accepted`);
    }
}
