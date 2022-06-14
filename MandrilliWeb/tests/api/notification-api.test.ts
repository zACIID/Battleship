import { HttpClient } from '@angular/common/http';

import { injectHttpClient } from '../fixtures/http-client';
import { authenticate, getCredentialsForUser } from '../fixtures/authentication';
import { SetupData } from '../fixtures/utils';
import { LoginInfo } from '../../src/app/core/api/handlers/auth-api';
import { deleteUser, InsertedUser, insertUser } from '../fixtures/database/users';
import { JwtProvider } from '../../src/app/core/api/jwt-auth/jwt-provider';
import { Notification, NotificationType } from '../../src/app/core/model/user/notification';
import { sendNotification } from '../fixtures/database/notifications';
import { NotificationApi } from '../../src/app/core/api/handlers/notification-api';

interface NotificationSetupData extends SetupData {
    insertedData: {
        sender: InsertedUser;
        receiver: InsertedUser;
        notificationToRemove: Notification;
    };
}

/**
 * Inserts a sender and a receiver with some notifications in the database,
 * to emulate the scenario where some user sends a notification to another user
 */
const setupDb = async (): Promise<NotificationSetupData> => {
    const sender: InsertedUser = await insertUser();
    const receiver: InsertedUser = await insertUser();

    const senderCred: LoginInfo = getCredentialsForUser(sender.userData.username);
    const jwtProvider: JwtProvider = await authenticate(senderCred);

    const notificationToRemove: Notification = {
        type: NotificationType.FriendRequest,
        sender: sender.userId,
    };
    const sentNotification: Notification = await sendNotification(
        jwtProvider,
        notificationToRemove,
        receiver.userId
    );

    return {
        apiAuthCredentials: senderCred,
        insertedData: {
            sender: sender,
            receiver: receiver,
            notificationToRemove: sentNotification,
        },
    };
};

/**
 * Deletes the two users created in the setup (sender, receiver)
 * @param setupData
 */
const teardownDb = async (setupData: NotificationSetupData): Promise<void> => {
    const { sender, receiver } = setupData.insertedData;

    await deleteUser(sender.userId);
    await deleteUser(receiver.userId);
};

let httpClient: HttpClient;
let senderJwtProvider: JwtProvider;
let setupData: NotificationSetupData;

const testSetup = async () => {
    httpClient = injectHttpClient();

    setupData = await setupDb();

    // Authenticate with the sender to make the add notification request
    const { sender } = setupData.insertedData;
    const senderCred: LoginInfo = getCredentialsForUser(sender.userData.username);
    senderJwtProvider = await authenticate(senderCred);
};

const testTeardown = async () => {
    await teardownDb(setupData);
};

describe('Get Notifications', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown();
    });

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const { receiver } = setupData.insertedData;

        const notificationApi: NotificationApi = new NotificationApi(httpClient, senderJwtProvider);

        notificationApi.getNotifications(receiver.userId).subscribe({
            next: (notifications: Notification[]) => {
                // Expect non-empty response
                expect(notifications).toBeTruthy();
                expect(notifications).toEqual(expect.any(Array));

                // Expect an object with the correct fields
                notifications.forEach((n: Notification) => {
                    expect(n).toEqual(
                        expect.objectContaining<Notification>({
                            type: expect.any(String),
                            sender: expect.any(String),
                        })
                    );
                });
            },
            complete: () => {
                done();
            },
        });
    });

    test('Should Throw', (done) => {
        const notificationApi: NotificationApi = new NotificationApi(httpClient, senderJwtProvider);

        notificationApi.getNotifications('wrong-user-id').subscribe({
            error: (err: Error) => {
                expect(err).toBeTruthy();

                done();
            },
            complete: () => {
                throw Error('Observable should not complete without throwing');
            },
        });
    });
});

describe('Add Notification', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown();
    });

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const { sender, receiver } = setupData.insertedData;

        const notificationApi: NotificationApi = new NotificationApi(httpClient, senderJwtProvider);

        const notificationToAdd: Notification = {
            // This has to be different from the type of the notification added in the setup
            type: NotificationType.MatchRequest,
            sender: sender.userId,
        };
        notificationApi.addNotification(receiver.userId, notificationToAdd).subscribe({
            next: (notification: Notification) => {
                // Expect non-empty response
                expect(notification).toBeTruthy();

                // Expect an object with the correct fields
                expect(notification).toEqual(
                    expect.objectContaining<Notification>({
                        type: expect.any(String),
                        sender: expect.any(String),
                    })
                );
            },
            complete: () => {
                done();
            },
        });
    });

    test('Should Throw', (done) => {
        const notificationApi: NotificationApi = new NotificationApi(httpClient, senderJwtProvider);

        const notificationToAdd: Notification = {
            type: NotificationType.MatchRequest,
            sender: 'any-user-id',
        };
        notificationApi.addNotification('wrong-user-id', notificationToAdd).subscribe({
            error: (err: Error) => {
                expect(err).toBeTruthy();

                done();
            },
            complete: () => {
                throw Error('Observable should not complete without throwing');
            },
        });
    });
});

describe('Remove Notification', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown();
    });

    test('Should Not Throw', (done) => {
        const { receiver, notificationToRemove } = setupData.insertedData;

        const notificationApi: NotificationApi = new NotificationApi(httpClient, senderJwtProvider);
        notificationApi.removeNotification(receiver.userId, notificationToRemove).subscribe({
            complete: () => {
                done();
            },
        });
    });

    test('Should Throw', (done) => {
        const { notificationToRemove } = setupData.insertedData;

        const notificationApi: NotificationApi = new NotificationApi(httpClient, senderJwtProvider);
        notificationApi.removeNotification('wrong-user-id', notificationToRemove).subscribe({
            error: (err: Error) => {
                expect(err).toBeTruthy();

                done();
            },
            complete: () => {
                throw Error('Observable should not complete without throwing');
            },
        });
    });
});
