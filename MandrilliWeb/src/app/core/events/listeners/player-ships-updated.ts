import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { ServerListener } from './base/server-listener';
import { Ship } from '../../model/match/ship';

export interface ShipsUpdateEventData {
    ships: Ship[]
}

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'player-ships-updated' server event.
 * Such event allows the client to get notified by the server when a player
 * of the match has updated the position of his ships.
 * This is useful, because the client can then update his state of the grid.
 */
Injectable({
    providedIn: "root"
})
export class PlayerShipsUpdatedListener extends ServerListener<ShipsUpdateEventData> {
    constructor(client: Socket) {
        super(client, 'player-ships-updated');
    }
}
