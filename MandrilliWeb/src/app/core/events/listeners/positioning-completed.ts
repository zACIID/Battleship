import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { ServerListener } from './base/server-listener';

export interface GenericEventMessage {
    message: string;
}

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'positioning-completed' server event.
 * Such event allows to get notified when both players in a match
 * have completed their positioning and the actual game phase
 * can start.
 */
Injectable({
    providedIn: "root"
})
export class PositioningCompletedListener extends ServerListener<GenericEventMessage> {
    constructor(client: Socket) {
        super(client, 'positioning-completed');
    }
}
