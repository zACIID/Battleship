import { TestBed } from '@angular/core/testing';
import { Socket } from 'ngx-socket-io';

import { socketIoTestbedConfig, joinServer } from '../../fixtures/socket-io-client';
import { SetupData } from '../../fixtures/utils';
import { deleteUser, InsertedUser, insertUser } from '../../fixtures/database/users';
import { authenticate, getCredentialsForUser } from '../../fixtures/authentication';
import { LoginInfo } from '../../../src/app/core/api/handlers/auth-api';
import { JwtProvider } from '../../../src/app/core/api/jwt-auth/jwt-provider';
import { FriendRequestAcceptedEmitter } from '../../../src/app/core/events/emitters/friend-request-accepted';
import { Notification, NotificationType } from '../../../src/app/core/model/user/notification';
import { sendNotification } from '../../fixtures/database/notifications';
import { FriendStatusChangedListener } from '../../../src/app/core/events/listeners/friend-status-changed';
import { FriendStatusChangedData } from '../../../src/app/core/model/events/friend-status-changed-data';
import { UserStatus } from '../../../src/app/core/model/user/user';

interface FriendRequestAcceptedSetupData extends SetupData {
    insertedData: {
        sender: InsertedUser;
        receiver: InsertedUser;
        friendRequest: Notification;
    };
}

/**
 * Inserts a sender, a receiver and the new notification in the database,
 * to emulate what would happen if some user sends a friend request to another user.
 */
const setupDb = async (): Promise<FriendRequestAcceptedSetupData> => {
    const sender: InsertedUser = await insertUser();
    const receiver: InsertedUser = await insertUser();

    // Authenticate with the sender to make the add notification request
    const senderCred: LoginInfo = getCredentialsForUser(sender.userData.username);
    const senderJwtProvider: JwtProvider = await authenticate(senderCred);

    // Send the friend request to the receiver
    const friendRequest: Notification = {
        type: NotificationType.FriendRequest,
        sender: sender.userId,
    };
    const sentFriendReq: Notification = await sendNotification(
        senderJwtProvider,
        friendRequest,
        receiver.userId
    );

    return {
        apiAuthCredentials: senderCred,
        insertedData: {
            sender: sender,
            receiver: receiver,
            friendRequest: sentFriendReq,
        },
    };
};

/**
 * Deletes the two users created in the setup (sender, receiver)
 * @param setupData
 */
const teardownDb = async (setupData: FriendRequestAcceptedSetupData): Promise<void> => {
    const { sender, receiver } = setupData.insertedData;

    await deleteUser(sender.userId);
    await deleteUser(receiver.userId);
};

let client: Socket;
let setupData: FriendRequestAcceptedSetupData;

const testSetup = async () => {
    TestBed.configureTestingModule(socketIoTestbedConfig);
    client = TestBed.inject(Socket);

    setupData = await setupDb();
};

const testTeardown = async () => {
    client.disconnect();

    await teardownDb(setupData);
};

describe('Friend Request Accepted', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown();
    });

    test('Should Correctly Fire Friend Status Changed Event', (done) => {
        const { sender, receiver } = setupData.insertedData;

        // Join the server with the sender, so that the event that notifies
        // the sender of the new friend can be listened to
        joinServer(sender.userId, client);

        // Listen to the friend status changed event
        const statusChangedListener: FriendStatusChangedListener = new FriendStatusChangedListener(
            client
        );
        statusChangedListener.listen((eventData: FriendStatusChangedData) => {
            // The new friend of the sender should be the receiver
            // and he should be online
            expect(eventData.friendId).toEqual(receiver.userId);
            expect(eventData.status).toEqual(UserStatus.Online);

            // End only after having listened to the event
            done();
        });

        // Accept the friend request
        const friendReqEmitter: FriendRequestAcceptedEmitter = new FriendRequestAcceptedEmitter(
            client
        );
        friendReqEmitter.emit({
            senderId: sender.userId,
            receiverId: receiver.userId,
        });
    });

    test('Event Name Should Be "friend-request-accepted"', () => {
        const friendReqEmitter: FriendRequestAcceptedEmitter = new FriendRequestAcceptedEmitter(
            client
        );

        expect(friendReqEmitter.eventName).toEqual('friend-request-accepted');
    });
});
