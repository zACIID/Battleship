import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';

import { Emitter } from './base/emitter';
import { PlayerWonData } from '../../model/events/player-won-data';

/**
 * Class that wraps socket.io functionality to generate a "player-won" event.
 * The user notifies the server that he has won the match, so the server can
 * update the game state accordingly and notify players and spectators that
 * the match has ended.
 */
Injectable({
    providedIn: 'root',
});
export class PlayerWonEmitter extends Emitter<PlayerWonData> {
    public constructor(client: Socket) {
        super(client, `player-won`);
    }
}
