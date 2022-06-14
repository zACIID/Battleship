import { TestBed } from '@angular/core/testing';
import { Socket } from 'ngx-socket-io';

import { joinMatch, leaveMatch, socketIoTestbedConfig } from '../../fixtures/socket-io-client';
import { MatchJoinedEmitter } from '../../../src/app/core/events/emitters/match-joined';
import { MatchLeftEmitter } from '../../../src/app/core/events/emitters/match-left';
import { createNMatch, deleteMatch, UserMatches } from '../../fixtures/database/matches';

let client: Socket;
let matchIdToJoin: string;

/**
 * Inserts a new match in the db
 */
const setupDb = async () => {
    const matches: UserMatches = await createNMatch(1);
    matchIdToJoin = matches.matchIds[0];
};

const teardownDb = async () => {
    await deleteMatch(matchIdToJoin);
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

describe('Join Match', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown();
    });

    test('Should Not Throw', () => {
        joinMatch(matchIdToJoin, client);
    });

    test('Event Name Should Be "match-joined"', () => {
        const matchJoinedEmitter: MatchJoinedEmitter = new MatchJoinedEmitter(client);

        expect(matchJoinedEmitter.eventName).toEqual('match-joined');
    });
});

describe('Join And Leave Chat', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown();
    });

    test('Should Not Throw', () => {
        joinMatch(matchIdToJoin, client);

        leaveMatch(matchIdToJoin, client);
    });

    test('Event Name Should Be "match-left"', () => {
        const matchLeftEmitter: MatchLeftEmitter = new MatchLeftEmitter(client);

        expect(matchLeftEmitter.eventName).toEqual('match-left');
    });
});
