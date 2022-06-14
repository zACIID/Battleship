import { TestBed } from '@angular/core/testing';
import { Socket } from 'ngx-socket-io';

import { getCredentialsForUser } from '../../fixtures/authentication';
import { LoginInfo } from '../../../src/app/core/api/handlers/auth-api';
import { deleteUser, InsertedUser, insertUser } from '../../fixtures/database/users';
import { joinServer, socketIoTestbedConfig } from '../../fixtures/socket-io-client';
import { SetupData } from '../../fixtures/utils';
import { FriendStatusChangedListener } from '../../../src/app/core/events/listeners/friend-status-changed';
import { FriendStatusChangedData } from '../../../src/app/core/model/events/friend-status-changed-data';
import { UserStatus } from '../../../src/app/core/model/user/user';

interface FriendStatusChangedSetupData extends SetupData {
    insertedData: {
        user: InsertedUser;
        friend: InsertedUser;
    };
}

/**
 * Inserts a user and his friend, to emulate a scenario where the first listens
 * for the change of status of the second
 */
const setupDb = async (): Promise<FriendStatusChangedSetupData> => {
    const user: InsertedUser = await insertUser();
    const friend: InsertedUser = await insertUser();

    const senderCred: LoginInfo = getCredentialsForUser(user.userData.username);

    return {
        apiAuthCredentials: senderCred,
        insertedData: {
            user: user,
            friend: friend,
        },
    };
};

/**
 * Deletes the two users created in the setup (sender, receiver)
 * @param setupData
 */
const teardownDb = async (setupData: FriendStatusChangedSetupData): Promise<void> => {
    const { user, friend } = setupData.insertedData;

    await deleteUser(user.userId);
    await deleteUser(friend.userId);
};

let friendClient: Socket;
let setupData: FriendStatusChangedSetupData;

const testSetup = async () => {
    TestBed.configureTestingModule(socketIoTestbedConfig);
    friendClient = TestBed.inject(Socket);

    setupData = await setupDb();
};

const testTeardown = async () => {
    friendClient.disconnect();

    await teardownDb(setupData);
};

describe('Notification Received', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown();
    });

    // Here only the Server Join scenario is tested.
    // In fact, we can assume that all the status changed events are fired correctly,
    // because they are tested separately in the backend, hence we just need to test that
    // the service we created can receive such events.
    test('Event Should Correctly Fire (on Server Join)', (done) => {
        const { friend } = setupData.insertedData;

        // Listen for the status changed event
        const friendStatusChangedListener: FriendStatusChangedListener =
            new FriendStatusChangedListener(friendClient);
        friendStatusChangedListener.listen((eventData: FriendStatusChangedData) => {
            expect(eventData.friendId).toEqual(friend.userId);
            expect(eventData.status).toEqual(UserStatus.Online);

            // End only after having listened to the event
            done();
        });

        // Join the server with the friend,
        // so that the user can be notified that his friend is online
        joinServer(friend.userId, friendClient);
    });

    test('Event Name Should Be "friend-status-changed"', () => {
        const friendStatusChangedListener: FriendStatusChangedListener =
            new FriendStatusChangedListener(friendClient);

        expect(friendStatusChangedListener.eventName).toEqual('friend-status-changed');
    });
});
