import { TestBed } from '@angular/core/testing';
import { Socket } from 'ngx-socket-io';

import { joinMatch, socketIoTestbedConfig } from '../../fixtures/socket-io-client';
import { SetupData } from '../../fixtures/utils';
import { deleteUser, InsertedUser, insertUser } from '../../fixtures/database/users';
import { authenticate, getCredentialsForUser } from '../../fixtures/authentication';
import { createNMatch, deleteMatch, UserMatches } from '../../fixtures/database/matches';
import { PlayerStateChangedListener } from '../../../src/app/core/events/listeners/player-state-changed';
import { changePlayerState } from '../../fixtures/api-utils/match-state';
import { LoginInfo } from '../../../src/app/core/api/handlers/auth-api';
import { JwtProvider } from '../../../src/app/core/api/jwt-auth/jwt-provider';
import { GenericMessage } from '../../../src/app/core/model/events/generic-message';
import { PositioningCompletedListener } from '../../../src/app/core/events/listeners/positioning-completed';

interface PositioningCompletedSetupData extends SetupData {
    insertedData: {
        player1: InsertedUser;
        player2: InsertedUser;
        matchId: string;
    };
}

/**
 * Inserts two players and a new match in the database
 */
const setupDb = async (): Promise<PositioningCompletedSetupData> => {
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
const teardownDb = async (setupData: PositioningCompletedSetupData): Promise<void> => {
    const { player1, player2, matchId } = setupData.insertedData;

    await deleteUser(player1.userId);
    await deleteUser(player2.userId);
    await deleteMatch(matchId);
};

let player1Client: Socket;
let player2Client: Socket;
let setupData: PositioningCompletedSetupData;

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

describe('Positioning Completed', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown();
    });

    test('Should Correctly Fire Positioning Completed Event', (done) => {
        const { player1, player2, matchId } = setupData.insertedData;

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

        // Check that the event returns some message
        // and terminate the test only if both events are fired
        const assertPositioningCompletedEvent = (eventData: GenericMessage) => {
            // Message could be any string
            expect(eventData.message).toEqual(expect.any(String));

            // End only after having listened to both events
            if (bothEventsFired()) {
                done();
            }
        };

        const p1Listener: PositioningCompletedListener = new PositioningCompletedListener(
            player1Client
        );
        const p2Listener: PositioningCompletedListener = new PositioningCompletedListener(
            player2Client
        );

        p1Listener.listen((eventData: GenericMessage) => {
            player1EventFired = true;

            assertPositioningCompletedEvent(eventData);
        });
        p2Listener.listen((eventData: GenericMessage) => {
            player2EventFired = true;

            assertPositioningCompletedEvent(eventData);
        });

        // Change the state of both the players to fire the positioning completed event
        const p1Cred: LoginInfo = getCredentialsForUser(player1.userData.username);
        authenticate(p1Cred).then((p1JwtProvider: JwtProvider) => {
            changePlayerState(p1JwtProvider, matchId, player1.userId, true);
        });
        const p2Cred: LoginInfo = getCredentialsForUser(player2.userData.username);
        authenticate(p2Cred).then((p2JwtProvider: JwtProvider) => {
            changePlayerState(p2JwtProvider, matchId, player2.userId, true);
        });
    });

    test('Event Name Should Be "positioning-completed"', () => {
        const listener: PlayerStateChangedListener = new PlayerStateChangedListener(player1Client);

        expect(listener.eventName).toEqual('positioning-completed');
    });
});
