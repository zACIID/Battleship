import { Socket } from 'ngx-socket-io';

import { injectSocketIoClient } from '../../fixtures/socket-io-client';
import { ServerJoinedEmitter } from '../../../src/app/core/events/emitters/server-joined';

let client: Socket;

// It should work with any string, since the matchId required is really
// just an identifier for the socket.io server room.
const userIdToJoin: string = 'any-user-id';

beforeEach(() => {
    client = injectSocketIoClient();
});

describe('Join Server', () => {
    test('Should Not Throw', () => {
        const serverJoinedEmitter: ServerJoinedEmitter = new ServerJoinedEmitter(client);
        serverJoinedEmitter.emit({
            userId: userIdToJoin,
        });
    });

    test('Event Name Should Be "server-joined"', () => {
        const serverJoinedEmitter: ServerJoinedEmitter = new ServerJoinedEmitter(client);

        expect(serverJoinedEmitter.eventName).toBe('server-joined');
    });
});
