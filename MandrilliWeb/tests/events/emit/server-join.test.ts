import { TestBed } from '@angular/core/testing';
import { Socket } from 'ngx-socket-io';

import { socketIoTestbedConfig, joinServer } from '../../fixtures/socket-io-client';
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

const testSetup = async () => {
    TestBed.configureTestingModule(socketIoTestbedConfig);
    client = TestBed.inject(Socket);

    await setupDb();
};

const testTeardown = async () => {
    client.disconnect();

    await teardownDb();
};

describe('Join Server', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown();
    });

    test('Should Not Throw', () => {
        joinServer(userIdToJoin, client);
    });

    test('Event Name Should Be "server-joined"', () => {
        const serverJoinedEmitter: ServerJoinedEmitter = new ServerJoinedEmitter(client);

        expect(serverJoinedEmitter.eventName).toEqual('server-joined');
    });
});
