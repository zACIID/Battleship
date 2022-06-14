import { TestBed } from '@angular/core/testing';
import { Socket } from 'ngx-socket-io';

import { joinMatch, socketIoTestbedConfig } from '../../fixtures/socket-io-client';
import { SetupData } from '../../fixtures/utils';
import { deleteUser, InsertedUser, insertUser } from '../../fixtures/database/users';
import { getCredentialsForUser } from '../../fixtures/authentication';
import { createNMatch, deleteMatch, UserMatches } from '../../fixtures/database/matches';
import { MatchTerminatedData } from '../../../src/app/core/model/events/match-terminated-data';
import { MatchTerminatedListener } from '../../../src/app/core/events/listeners/match-terminated';
import { PlayerWonEmitter } from '../../../src/app/core/events/emitters/player-won';
import { FriendStatusChangedListener } from '../../../src/app/core/events/listeners/friend-status-changed';

interface MatchRequestAcceptedSetupData extends SetupData {
    insertedData: {
        player1: InsertedUser;
        player2: InsertedUser;
        matchId: string;
    };
}

/**
 * Inserts two players and a new match in the database,
 * to emulate the scenario where one player wins a match.
 */
const setupDb = async (): Promise<MatchRequestAcceptedSetupData> => {
    const player1: InsertedUser = await insertUser();
    const player2: InsertedUser = await insertUser();

    const matches: UserMatches = await createNMatch(1);
    const matchId: string = matches.matchIds[0];

    return {
        apiAuthCredentials: getCredentialsForUser(player1.userData.username),
        insertedData: {
            player1: player1,
            player2: player2,
            matchId: matchId,
        },
    };
};

/**
 * Delete the two players and the match created in the setup
 * @param setupData
 */
const teardownDb = async (setupData: MatchRequestAcceptedSetupData): Promise<void> => {
    const { player1, player2, matchId } = setupData.insertedData;

    await deleteUser(player1.userId);
    await deleteUser(player2.userId);
    await deleteMatch(matchId);
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
        const { player2, matchId } = setupData.insertedData;

        // Join the match with both players,
        // so that the match terminated event can be listened to
        joinMatch(matchId, player1Client);
        joinMatch(matchId, player2Client);

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
            matchId: setupData.insertedData.matchId,
            winnerId: player2.userId,
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
