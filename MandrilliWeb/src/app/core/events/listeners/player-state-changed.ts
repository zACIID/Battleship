import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { ServerListener } from './base/server-listener';

export interface StateChangedEventData {
    playerId: string;
    ready: Boolean;
}

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'player-state-changed' server event.
 * Such event allows to get notified when a player during the current
 * match changes his "ready" state, which defines if he has completed
 * his positioning phase or not.
 */
Injectable({
    providedIn: "root"
})
export class PlayerStateChangedListener extends ServerListener<StateChangedEventData> {
    constructor(client: Socket) {
        super(client, 'player-state-changed');
    }
}
