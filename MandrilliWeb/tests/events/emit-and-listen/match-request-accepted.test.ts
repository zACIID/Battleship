import { TestBed } from '@angular/core/testing';
import { Socket } from 'ngx-socket-io';

import { joinServer, socketIoTestbedConfig } from '../../fixtures/socket-io-client';
import { SetupData } from '../../fixtures/utils';
import { deleteUser, InsertedUser, insertUser } from '../../fixtures/database/users';
import { authenticate, getCredentialsForUser } from '../../fixtures/authentication';
import { LoginInfo } from '../../../src/app/core/api/handlers/auth-api';
import { JwtProvider } from '../../../src/app/core/api/jwt-auth/jwt-provider';
import { MatchRequestAcceptedEmitter } from '../../../src/app/core/events/emitters/match-request-accepted';
import { Notification, NotificationType } from '../../../src/app/core/model/user/notification';
import { sendNotification } from '../../fixtures/api-utils/notifications';
import { MatchFoundListener } from '../../../src/app/core/events/listeners/match-found';
import { MatchData } from '../../../src/app/core/model/events/match-data';
import { deleteMatch } from '../../fixtures/database/matches';
import { MatchTerminatedListener } from '../../../src/app/core/events/listeners/match-terminated';

interface MatchRequestAcceptedSetupData extends SetupData {
    insertedData: {
        sender: InsertedUser;
        receiver: InsertedUser;
        matchRequest: Notification;
    };
}

/**
 * Inserts a sender, a receiver and the new match in the database,
 * to emulate what would happen if some user sends a match request to another user.
 */
const setupDb = async (): Promise<MatchRequestAcceptedSetupData> => {
    const sender: InsertedUser = await insertUser();
    const receiver: InsertedUser = await insertUser();

    // Authenticate with the sender to make the add notification request
    const senderCred: LoginInfo = getCredentialsForUser(sender.userData.username);
    const senderJwtProvider: JwtProvider = await authenticate(senderCred);

    // Send the friend request to the receiver
    const matchRequest: Notification = {
        type: NotificationType.MatchRequest,
        sender: sender.userId,
    };
    const sentMatchRequest: Notification = await sendNotification(
        senderJwtProvider,
        matchRequest,
        receiver.userId
    );

    return {
        apiAuthCredentials: senderCred,
        insertedData: {
            sender: sender,
            receiver: receiver,
            matchRequest: sentMatchRequest,
        },
    };
};

/**
 * Delete the two users created in the setup (sender, receiver)
 * @param setupData
 */
const teardownDb = async (setupData: MatchRequestAcceptedSetupData): Promise<void> => {
    const { sender, receiver } = setupData.insertedData;

    await deleteUser(sender.userId);
    await deleteUser(receiver.userId);
};

let senderClient: Socket;
let receiverClient: Socket;
let setupData: MatchRequestAcceptedSetupData;

const testSetup = async () => {
    TestBed.configureTestingModule(socketIoTestbedConfig);
    senderClient = TestBed.inject(Socket);
    receiverClient = TestBed.inject(Socket);

    setupData = await setupDb();
};

const testTeardown = async () => {
    senderClient.disconnect();
    receiverClient.disconnect();

    await teardownDb(setupData);
};

describe('Match Request Accepted - Match Found', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown();
    });

    test('Should Correctly Fire Match Found Event', (done) => {
        const { sender, receiver } = setupData.insertedData;

        // Join the server with both the receiver and the sender,
        // so that the match found event, that notifies both, can be listened to
        joinServer(sender.userId, senderClient);
        joinServer(receiver.userId, receiverClient);

        // Listen to both the match found events
        let senderEventFired: boolean = false;
        let receiverEventFired: boolean = false;
        const bothEventsFired = () => {
            return senderEventFired && receiverEventFired;
        };

        // Check that the event returns a valid matchId
        // and terminate the test only if both events are fired
        const assertMatchFoundEvent = async (eventData: MatchData) => {
            // Match id could be any string
            expect(eventData.matchId).toEqual(expect.any(String));

            // End only after having listened to both events
            if (bothEventsFired()) {
                // Teardown: delete the created match
                await deleteMatch(eventData.matchId);

                done();
            }
        };

        const senderMatchFoundListener: MatchFoundListener = new MatchFoundListener(senderClient);
        const recMatchFoundListener: MatchFoundListener = new MatchFoundListener(receiverClient);

        senderMatchFoundListener.listen((eventData: MatchData) => {
            senderEventFired = true;

            assertMatchFoundEvent(eventData);
        });
        recMatchFoundListener.listen((eventData: MatchData) => {
            receiverEventFired = true;

            assertMatchFoundEvent(eventData);
        });

        // Accept the match request
        const matchReqEmitter: MatchRequestAcceptedEmitter = new MatchRequestAcceptedEmitter(
            receiverClient
        );
        matchReqEmitter.emit({
            senderId: sender.userId,
            receiverId: receiver.userId,
        });
    });

    test('Emitter Event Name Should Be "match-request-accepted"', () => {
        const matchReqEmitter: MatchRequestAcceptedEmitter = new MatchRequestAcceptedEmitter(
            senderClient
        );

        expect(matchReqEmitter.eventName).toEqual('match-request-accepted');
    });

    test('Listener Event Name Should Be "match-found"', () => {
        const listener: MatchFoundListener = new MatchFoundListener(senderClient);

        expect(listener.eventName).toEqual('match-terminated');
    });
});
