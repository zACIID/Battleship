import { TestBed } from '@angular/core/testing';
import { Socket } from 'ngx-socket-io';

import { joinMatch, socketIoTestbedConfig } from '../../fixtures/socket-io-client';
import { authenticate } from '../../fixtures/authentication';
import {
    insertMultipleMatches,
    MatchesSetupData,
    teardownMatches,
    InsertedMatch,
} from '../../fixtures/database/matches';
import { PlayerStateChangedData } from '../../../src/app/core/model/events/player-state-changed-data';
import { PlayerStateChangedListener } from '../../../src/app/core/events/listeners/player-state-changed';
import { changePlayerState } from '../../fixtures/api-utils/match-state';
import { LoginInfo } from '../../../src/app/core/api/handlers/auth-api';
import { JwtProvider } from '../../../src/app/core/api/jwt-auth/jwt-provider';

interface PlayerStateChangedSetupData extends MatchesSetupData {}

/**
 * Inserts a new match in the database, along with its players,
 * to emulate the scenario where one player wins a match.
 */
const setupDb = async (): Promise<PlayerStateChangedSetupData> => {
    return await insertMultipleMatches(1);
};

const teardownDb = async (setupData: PlayerStateChangedSetupData): Promise<void> => {
    await teardownMatches(setupData);
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
        const { insMatches } = setupData.insertedData;
        const currentMatch: InsertedMatch = insMatches[0];

        const matchId: string = currentMatch.matchId;
        const player1Id: string = currentMatch.playerIds[0];

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

        // Check that the event returns the correct state
        // and terminate the test only if both events are fired
        const newState: boolean = true;
        const assertStateChangedEvent = (eventData: PlayerStateChangedData) => {
            // Match id could be any string
            expect(eventData.isReady).toEqual(newState);

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
        const apiCred: LoginInfo = setupData.apiAuthCredentials;
        authenticate(apiCred).then((jwtProvider: JwtProvider) => {
            changePlayerState(jwtProvider, matchId, player1Id, newState);
        });
    });

    test('Event Name Should Be "player-state-changed"', () => {
        const listener: PlayerStateChangedListener = new PlayerStateChangedListener(player1Client);

        expect(listener.eventName).toEqual('player-state-changed');
    });
});
