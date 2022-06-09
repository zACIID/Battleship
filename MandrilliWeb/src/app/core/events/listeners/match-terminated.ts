import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { ServerListener } from './base/server-listener';

/**
 * Enumeration that defines all the possible reasons why a match could terminate
 */
export enum MatchTerminatedReason {
    PlayerLeftTheGame = 'A player has left the game',
    Player1Won = 'Player 1 has won the game',
    Player2Won = 'Player 2 has won the game',
}

export interface MatchTerminatedData {
    reason: MatchTerminatedReason;
}

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
        super(client, 'friend-status-changed');
    }
}
