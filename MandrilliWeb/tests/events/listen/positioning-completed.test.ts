import { TestBed } from '@angular/core/testing';
import { Socket } from 'ngx-socket-io';

import { joinMatch, socketIoTestbedConfig } from '../../fixtures/socket-io-client';
import { authenticate } from '../../fixtures/authentication';
import {
    InsertedMatch,
    insertMultipleMatches,
    MatchesSetupData,
    teardownMatches,
} from '../../fixtures/database/matches';
import { changePlayerState } from '../../fixtures/api-utils/match-state';
import { LoginInfo } from '../../../src/app/core/api/handlers/auth-api';
import { JwtProvider } from '../../../src/app/core/api/jwt-auth/jwt-provider';
import { GenericMessage } from '../../../src/app/core/model/events/generic-message';
import { PositioningCompletedListener } from '../../../src/app/core/events/listeners/positioning-completed';

interface PositioningCompletedSetupData extends MatchesSetupData {}

/**
 * Inserts a new match in the database, along with its players,
 * to emulate the scenario where one player wins a match.
 */
const setupDb = async (): Promise<PositioningCompletedSetupData> => {
    return await insertMultipleMatches(1);
};

const teardownDb = async (setupData: PositioningCompletedSetupData): Promise<void> => {
    await teardownMatches(setupData);
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
        const { insMatches } = setupData.insertedData;
        const currentMatch: InsertedMatch = insMatches[0];

        const matchId: string = currentMatch.matchId;
        const player1Id: string = currentMatch.playerIds[0];
        const player2Id: string = currentMatch.playerIds[1];

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
        const apiCred: LoginInfo = setupData.apiAuthCredentials;
        authenticate(apiCred).then((jwtProvider: JwtProvider) => {
            changePlayerState(jwtProvider, matchId, player1Id, true).then(() => {
                // TODO there is a NASTY race condition here. If the below function call
                //  is moved out of the promise.then(), the event positioning-completed
                //  never fires. This is because the two endpoint calls are so close in time
                //  that the server never has the chance to update the match state before
                //  the second call arrives, which results in only the second call
                //  having any effect. This means that only player2.isReady=true,
                //  while player1.isReady=false
                changePlayerState(jwtProvider, matchId, player2Id, true);
            });
        });
    });

    test('Event Name Should Be "positioning-completed"', () => {
        const listener: PositioningCompletedListener = new PositioningCompletedListener(
            player2Client
        );

        expect(listener.eventName).toEqual('positioning-completed');
    });
});
