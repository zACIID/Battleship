import { TestBed } from '@angular/core/testing';
import { Socket } from 'ngx-socket-io';

import { joinMatch, leaveMatch, socketIoTestbedConfig } from '../../fixtures/socket-io-client';
import { MatchJoinedEmitter } from '../../../src/app/core/events/emitters/match-joined';
import { MatchLeftEmitter } from '../../../src/app/core/events/emitters/match-left';
import {
    insertMultipleMatches,
    MatchesSetupData,
    teardownMatches,
} from '../../fixtures/database/matches';
import { JoinReason } from '../../../src/app/core/model/events/match-joined-data';

let client: Socket;
let setupData: MatchesSetupData;
let matchIdToJoin: string;
let userIdJoining: string;

/**
 * Inserts a new match in the db
 */
const setupDb = async () => {
    setupData = await insertMultipleMatches(1);
    const { insMatches } = setupData.insertedData;

    matchIdToJoin = insMatches[0].matchId;
    userIdJoining = insMatches[0].playerIds[0];
};

const teardownDb = async () => {
    await teardownMatches(setupData);
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
        joinMatch(client, {
            matchId: matchIdToJoin,
            userId: userIdJoining,
            joinReason: JoinReason.Player,
        });
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
        joinMatch(client, {
            matchId: matchIdToJoin,
            userId: userIdJoining,
            joinReason: JoinReason.Player,
        });

        leaveMatch(client, {
            matchId: matchIdToJoin,
            userId: userIdJoining,
        });
    });

    test('Event Name Should Be "match-left"', () => {
        const matchLeftEmitter: MatchLeftEmitter = new MatchLeftEmitter(client);

        expect(matchLeftEmitter.eventName).toEqual('match-left');
    });
});
