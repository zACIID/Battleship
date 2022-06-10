import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { ServerListener } from './base/server-listener';
import { ShotData } from '../../model/events/shot-data';

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'shot-fired' server event.
 * Such event allows to get notified when a player has fired a shot
 * during the match, with the server sending information about
 * the fired shot.
 */
@Injectable({
    providedIn: 'root',
})
export class ShotFiredListener extends ServerListener<ShotData> {
    constructor(client: Socket) {
        super(client, 'shot-fired');
    }
}
