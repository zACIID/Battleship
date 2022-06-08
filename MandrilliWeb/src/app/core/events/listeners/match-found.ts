import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { ServerListener } from './base/server-listener';

export interface MatchFoundEventData {
    matchId: string;
}

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'match-found' server event.
 * Such event allows the user to be notified when the server has arranged
 * a new match for him. This can happen either when another user accepts a match
 * request or when the matchmaking engine finds a suitable pair of players for a game.
 */
Injectable({
    providedIn: 'root',
});
export class MatchFoundListener extends ServerListener<MatchFoundEventData> {
    constructor(client: Socket) {
        super(client, 'match-found');
    }
}
