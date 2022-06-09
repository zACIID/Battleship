import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { ServerListener } from './base/server-listener';
import { MatchTerminatedData } from '../../model/events/match-terminated-data';

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'match-terminated' server event.
 * Such event allows the clients that are playing in or spectating a match
 * to get notified by the server when such match is terminated.
 * The server sends a message containing the reason the match was terminated,
 * which could be either that one player has left the match or one player has won.
 */
Injectable({
    providedIn: 'root',
});
export class MatchTerminatedListener extends ServerListener<MatchTerminatedData> {
    constructor(client: Socket) {
        super(client, 'match-terminated');
    }
}
