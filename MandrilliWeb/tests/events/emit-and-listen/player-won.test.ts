import { TestBed } from '@angular/core/testing';
import { Socket } from 'ngx-socket-io';

import { joinMatch, socketIoTestbedConfig } from '../../fixtures/socket-io-client';
import {
    InsertedMatch,
    insertMultipleMatches,
    MatchesSetupData,
    teardownMatches,
} from '../../fixtures/database/matches';
import { MatchTerminatedData } from '../../../src/app/core/model/events/match-terminated-data';
import { MatchTerminatedListener } from '../../../src/app/core/events/listeners/match-terminated';
import { PlayerWonEmitter } from '../../../src/app/core/events/emitters/player-won';
import { JoinReason } from '../../../src/app/core/model/events/match-joined-data';

interface MatchRequestAcceptedSetupData extends MatchesSetupData {}

/**
 * Inserts a new match in the database, along with its players,
 * to emulate the scenario where one player wins a match.
 */
const setupDb = async (): Promise<MatchRequestAcceptedSetupData> => {
    return await insertMultipleMatches(1);
};

const teardownDb = async (setupData: MatchRequestAcceptedSetupData): Promise<void> => {
    await teardownMatches(setupData);
};

let player1Client: Socket;
let player2Client: Socket;
let setupData: MatchRequestAcceptedSetupData;

const testSetup = async () => {
    TestBed.configureTestingModule(socketIoTestbedConfig);
    player1Client = TestBed.inject(Socket);
    player2Client = TestBed.inject(Socket);

    setupData = await setupDb();
};

const testTeardown = async () => {
    player1Client.disconnect();
    player2Client.disconnect();

    await teardownDb(setupData);
};

describe('Player Won - Match Terminated', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown();
    });

    test('Should Correctly Fire Match Terminated Event', (done) => {
        const { insMatches } = setupData.insertedData;
        const currentMatch: InsertedMatch = insMatches[0];

        const matchId: string = currentMatch.matchId;
        const player1Id: string = currentMatch.playerIds[0];
        const player2Id: string = currentMatch.playerIds[1];

        // Join the match with both players,
        // so that the match terminated event can be listened to
        joinMatch(player1Client, {
            matchId: matchId,
            userId: player1Id,
            joinReason: JoinReason.Player,
        });
        joinMatch(player2Client, {
            matchId: matchId,
            userId: player2Id,
            joinReason: JoinReason.Player,
        });

        // Listen to both the match found events
        let player1EventFired: boolean = false;
        let player2EventFired: boolean = false;
        const bothEventsFired = () => {
            return player1EventFired && player2EventFired;
        };

        // Check that the event returns a valid reason
        // and terminate the test only if both events are fired
        const assertMatchTerminatedEvent = (eventData: MatchTerminatedData) => {
            // Match id could be any string
            expect(eventData.reason).toEqual(expect.any(String));
            expect(eventData.winnerUsername).toEqual(expect.any(String));

            // End only after having listened to both events
            if (bothEventsFired()) {
                done();
            }
        };

        const p1MatchTerminatedListener: MatchTerminatedListener = new MatchTerminatedListener(
            player1Client
        );
        const p2MatchTerminatedListener: MatchTerminatedListener = new MatchTerminatedListener(
            player2Client
        );

        p1MatchTerminatedListener.listen((eventData: MatchTerminatedData) => {
            player1EventFired = true;

            assertMatchTerminatedEvent(eventData);
        });
        p2MatchTerminatedListener.listen((eventData: MatchTerminatedData) => {
            player2EventFired = true;

            assertMatchTerminatedEvent(eventData);
        });

        // Fire the event with player2
        const playerWonEmitter: PlayerWonEmitter = new PlayerWonEmitter(player2Client);
        playerWonEmitter.emit({
            matchId: matchId,
            winnerId: player2Id,
        });
    });

    test('Emitter Event Name Should Be "player-won"', () => {
        const playerWonEmitter: PlayerWonEmitter = new PlayerWonEmitter(player1Client);

        expect(playerWonEmitter.eventName).toEqual('player-won');
    });

    test('Listener Event Name Should Be "match-terminated"', () => {
        const listener: MatchTerminatedListener = new MatchTerminatedListener(player2Client);

        expect(listener.eventName).toEqual('match-terminated');
    });
});
