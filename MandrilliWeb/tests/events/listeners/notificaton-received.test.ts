import { TestBed } from '@angular/core/testing';
import { Socket } from 'ngx-socket-io';

import { authenticate, getCredentialsForUser } from '../../fixtures/authentication';
import { LoginInfo } from '../../../src/app/core/api/handlers/auth-api';
import { deleteUser, InsertedUser, insertUser } from '../../fixtures/database/users';
import { JwtProvider } from '../../../src/app/core/api/jwt-auth/jwt-provider';
import { joinServer, socketIoTestbedConfig } from '../../fixtures/socket-io-client';
import { sendNotification } from '../../fixtures/database/notifications';
import { SetupData } from '../../fixtures/utils';
import { NotificationReceivedListener } from '../../../src/app/core/events/listeners/notification-received';
import { NotificationType, Notification } from '../../../src/app/core/model/user/notification';
import { NotificationData } from '../../../src/app/core/model/events/notification-data';

interface NotificationReceivedSetupData extends SetupData {
    insertedData: {
        sender: InsertedUser;
        receiver: InsertedUser;
    };
}

/**
 * Inserts a sender and a receiver in the database,
 * to emulate the scenario where some user sends a notification to another user
 */
const setupDb = async (): Promise<NotificationReceivedSetupData> => {
    const sender: InsertedUser = await insertUser();
    const receiver: InsertedUser = await insertUser();

    const senderCred: LoginInfo = getCredentialsForUser(sender.userData.username);

    return {
        apiAuthCredentials: senderCred,
        insertedData: {
            sender: sender,
            receiver: receiver,
        },
    };
};

/**
 * Deletes the two users created in the setup (sender, receiver)
 * @param setupData
 */
const teardownDb = async (setupData: NotificationReceivedSetupData): Promise<void> => {
    const { sender, receiver } = setupData.insertedData;

    await deleteUser(sender.userId);
    await deleteUser(receiver.userId);
};

let receiverClient: Socket;
let senderJwtProvider: JwtProvider;
let setupData: NotificationReceivedSetupData;

const testSetup = async () => {
    TestBed.configureTestingModule(socketIoTestbedConfig);
    receiverClient = TestBed.inject(Socket);

    setupData = await setupDb();

    // Authenticate with the sender to make the add notification request
    const { sender } = setupData.insertedData;
    const senderCred: LoginInfo = getCredentialsForUser(sender.userData.username);
    senderJwtProvider = await authenticate(senderCred);
};

const testTeardown = async () => {
    receiverClient.disconnect();

    await teardownDb(setupData);
};

describe('Notification Received', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown();
    });

    test('New Notification Should Correctly Fire Notification Received Event', (done) => {
        const { receiver } = setupData.insertedData;

        // Join the server with the receiver, so that it can listen to the
        // notification received event
        joinServer(receiver.userId, receiverClient);

        // Send the notification
        const notificationToSend: Notification = {
            type: NotificationType.FriendRequest,
            sender: receiver.userId,
        };

        sendNotification(senderJwtProvider, notificationToSend, receiver.userId).then(
            (sentNotification: Notification) => {
                // Listen to the friend status changed event
                const notificationListener: NotificationReceivedListener =
                    new NotificationReceivedListener(receiverClient);
                notificationListener.listen((eventData: NotificationData) => {
                    // The new friend of the sender should be the receiver
                    // and he should be online
                    expect(eventData.type).toEqual(sentNotification.type);
                    expect(eventData.sender).toEqual(sentNotification.sender);

                    // End only after having listened to the event
                    done();
                });
            }
        );
    });

    test('Event Name Should Be "notification-received"', () => {
        const notificationListener: NotificationReceivedListener = new NotificationReceivedListener(
            receiverClient
        );

        expect(notificationListener.eventName).toEqual('notification-received');
    });
});
