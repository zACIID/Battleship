import { Socket } from 'ngx-socket-io';

import { injectSocketIoClient, joinServer } from '../../fixtures/socket-io-client';
import { ServerJoinedEmitter } from '../../../src/app/core/events/emitters/server-joined';
import { InsertedUser, deleteUser, insertUser } from '../../fixtures/database/users';

let client: Socket;
let userIdToJoin: string;

/**
 * Inserts in the db the user to join the server with
 */
const setupDb = async () => {
    const insertedUser: InsertedUser = await insertUser();
    userIdToJoin = insertedUser.userId;
};

/**
 * Deletes the inserted user from the db
 */
const teardownDb = async () => {
    await deleteUser(userIdToJoin);
};

describe('Join Server', () => {
    beforeEach(() => {
        client = injectSocketIoClient();

        setupDb();
    });

    afterEach(async () => {
        await teardownDb();
    });

    test('Should Not Throw', () => {
        joinServer(userIdToJoin, client);
    });

    test('Event Name Should Be "server-joined"', () => {
        const serverJoinedEmitter: ServerJoinedEmitter = new ServerJoinedEmitter(client);

        expect(serverJoinedEmitter.eventName).toBe('server-joined');
    });
});
