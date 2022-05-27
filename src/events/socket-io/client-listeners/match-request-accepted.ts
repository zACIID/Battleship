import { Socket } from "socket.io";

import { ClientListener } from "./base/client-listener";
import { RequestNotification } from "../../../models/user/notification";

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'match-request-accepted' client event.
 * Such event happens when a user accepts a match request.
 * The match is created between the two users, who are then notified.
 */
export class MatchRequestAcceptedListener extends ClientListener {
    constructor(client: Socket) {
        super(client, "match-request-accepted");
    }

    listen() {
        super.listen((requestData: RequestNotification) => {
            // TODO creare match e notificare che match
            //  è stato creato (funzione createMatchAndNotify??)
            xxx
        });
    }
}
