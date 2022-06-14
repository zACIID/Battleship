import { TestBed } from '@angular/core/testing';
import { Socket } from 'ngx-socket-io';

import { joinMatch, socketIoTestbedConfig } from '../../fixtures/socket-io-client';
import { SetupData } from '../../fixtures/utils';
import { deleteUser, InsertedUser, insertUser } from '../../fixtures/database/users';
import { authenticate, getCredentialsForUser } from '../../fixtures/authentication';
import { createNMatch, deleteMatch, UserMatches } from '../../fixtures/database/matches';
import { MatchTerminatedData } from '../../../src/app/core/model/events/match-terminated-data';
import { MatchTerminatedListener } from '../../../src/app/core/events/listeners/match-terminated';
import { PlayerWonEmitter } from '../../../src/app/core/events/emitters/player-won';
import { PlayerStateChangedData } from '../../../src/app/core/model/events/player-state-changed-data';
import { PlayerStateChangedListener } from '../../../src/app/core/events/listeners/player-state-changed';
import axios from 'axios';
import { changePlayerState } from '../../fixtures/api-utils/match-state';
import { LoginInfo } from '../../../src/app/core/api/handlers/auth-api';
import { JwtProvider } from '../../../src/app/core/api/jwt-auth/jwt-provider';

interface PlayerStateChangedSetupData extends SetupData {
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
const setupDb = async (): Promise<PlayerStateChangedSetupData> => {
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
const teardownDb = async (setupData: PlayerStateChangedSetupData): Promise<void> => {
    const { player1, player2, matchId } = setupData.insertedData;

    await deleteUser(player1.userId);
    await deleteUser(player2.userId);
    await deleteMatch(matchId);
};

let player1Client: Socket;
let player2Client: Socket;
let setupData: PlayerStateChangedSetupData;

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

describe('Player State Changed', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown();
    });

    test('Should Correctly Fire Player State Changed Event', (done) => {
        const { player1, matchId } = setupData.insertedData;

        // Join the match with both players,
        // so that the state changed event can be listened to
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
        const assertStateChangedEvent = (eventData: PlayerStateChangedData) => {
            // Match id could be any string
            expect(eventData.isReady).toEqual(expect.any(String));

            // End only after having listened to both events
            if (bothEventsFired()) {
                done();
            }
        };

        const p1StateListener: PlayerStateChangedListener = new PlayerStateChangedListener(
            player1Client
        );
        const p2StateListener: PlayerStateChangedListener = new PlayerStateChangedListener(
            player2Client
        );

        p1StateListener.listen((eventData: PlayerStateChangedData) => {
            player1EventFired = true;

            assertStateChangedEvent(eventData);
        });
        p2StateListener.listen((eventData: PlayerStateChangedData) => {
            player2EventFired = true;

            assertStateChangedEvent(eventData);
        });

        // Change the state of a player to make the server fire the event
        // In this case, we change the state of player1, which should raise
        // the event for every listener of the match (in this case, player1 and player2)
        const p1Cred: LoginInfo = getCredentialsForUser(player1.userData.username);
        authenticate(p1Cred).then((p1JwtProvider: JwtProvider) => {
            changePlayerState(p1JwtProvider, matchId, player1.userId, true);
        });
    });

    // TODO change here and run tests
    test('Event Name Should Be "player-won"', () => {
        const playerWonEmitter: PlayerWonEmitter = new PlayerWonEmitter(player1Client);

        expect(playerWonEmitter.eventName).toEqual('player-won');
    });
});
