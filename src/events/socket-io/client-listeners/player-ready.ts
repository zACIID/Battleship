import { Socket } from 'socket.io';
import { ClientListener } from './base/client-listener';

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'player-ready' client event.
 * Such event happens when a player has ended his positioning phase.
 * The other player is then notified of this occurrence.
 */
export class PlayerReadyListener extends ClientListener {
    constructor(client: Socket) {
        super(client, 'player-ready');
    }

    listen() {
        super.listen(() => {
            // TODO settare PlayerState su MatchDocument a ready e notificare opponent
           ;
        });
        PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPIEERRRRS
    }
}
