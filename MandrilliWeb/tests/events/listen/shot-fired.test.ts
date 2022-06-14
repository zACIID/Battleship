import { TestBed } from '@angular/core/testing';
import { Socket } from 'ngx-socket-io';

import { joinMatch, socketIoTestbedConfig } from '../../fixtures/socket-io-client';
import { SetupData } from '../../fixtures/utils';
import { deleteUser, InsertedUser, insertUser } from '../../fixtures/database/users';
import { authenticate, getCredentialsForUser } from '../../fixtures/authentication';
import { createNMatch, deleteMatch, UserMatches } from '../../fixtures/database/matches';
import { fireShot } from '../../fixtures/api-utils/match-state';
import { LoginInfo } from '../../../src/app/core/api/handlers/auth-api';
import { JwtProvider } from '../../../src/app/core/api/jwt-auth/jwt-provider';
import { Shot } from '../../../src/app/core/model/api/match/shot';
import { ShotFiredListener } from '../../../src/app/core/events/listeners/shot-fired';
import { ShotData } from '../../../src/app/core/model/events/shot-data';

interface ShotFiredSetupData extends SetupData {
    insertedData: {
        player1: InsertedUser;
        player2: InsertedUser;
        matchId: string;
    };
}

/**
 * Inserts two players and a new match in the database
 */
const setupDb = async (): Promise<ShotFiredSetupData> => {
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
const teardownDb = async (setupData: ShotFiredSetupData): Promise<void> => {
    const { player1, player2, matchId } = setupData.insertedData;

    await deleteUser(player1.userId);
    await deleteUser(player2.userId);
    await deleteMatch(matchId);
};

let player1Client: Socket;
let player2Client: Socket;
let setupData: ShotFiredSetupData;

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

describe('Shot Fired', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown();
    });

    test('Should Correctly Fire "Shot Fired" Event', (done) => {
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

        const shotToFire: Shot = {
            playerId: player1.userId,
            coordinates: {
                row: 9,
                col: 9,
            },
        };

        // Check that the event returns a valid shot
        // and terminate the test only if both events are fired
        const assertShotFiredEvent = (eventData: ShotData) => {
            // Check that the shot matches what was fired
            expect(eventData.playerId).toEqual(shotToFire.playerId);
            expect(eventData.coordinates).toEqual(shotToFire.coordinates);

            // End only after having listened to both events
            if (bothEventsFired()) {
                done();
            }
        };

        // Note that everyone who joined the match receives the event,
        // even the player that fired the shot
        const p1Listener: ShotFiredListener = new ShotFiredListener(player1Client);
        const p2Listener: ShotFiredListener = new ShotFiredListener(player2Client);

        p1Listener.listen((eventData: ShotData) => {
            player1EventFired = true;

            assertShotFiredEvent(eventData);
        });
        p2Listener.listen((eventData: ShotData) => {
            player2EventFired = true;

            assertShotFiredEvent(eventData);
        });

        // Fire the shot with one player via the api to raise the event
        const p1Cred: LoginInfo = getCredentialsForUser(player1.userData.username);
        authenticate(p1Cred).then((p1JwtProvider: JwtProvider) => {
            fireShot(p1JwtProvider, matchId, shotToFire);
        });
    });

    test('Event Name Should Be "shot-fired"', () => {
        const listener: ShotFiredListener = new ShotFiredListener(player1Client);

        expect(listener.eventName).toEqual('shot-fired');
    });
});
