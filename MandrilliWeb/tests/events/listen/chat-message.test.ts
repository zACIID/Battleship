import { deleteMultipleUsers, deleteUser, InsertedUser, insertUser } from '../../fixtures/database/users';
import { authenticate, getCredentialsForUser } from '../../fixtures/authentication';
import { TestBed } from '@angular/core/testing';
import { Socket } from 'ngx-socket-io';
import { joinChat, joinServer, socketIoTestbedConfig } from '../../fixtures/socket-io-client';
import { LoginInfo } from '../../../src/app/core/api/handlers/auth-api';
import { JwtProvider } from '../../../src/app/core/api/jwt-auth/jwt-provider';
import { SetupData } from '../../fixtures/utils';
import { ChatMessage } from 'src/app/core/model/events/chat-message';
import { ChatMessageListener } from 'src/app/core/events/listeners/chat-message';
import { sendMessage } from 'tests/fixtures/api-utils/chat-message';
import { Types } from 'mongoose';
import { MongoDbApi } from 'tests/fixtures/database/mongodb-api';
import { deleteChat, deleteMultipleChats } from 'tests/fixtures/database/chats';

export interface MessageReceivedSetupData extends SetupData {
    insertedData: {
        chatId: string,
        sender: InsertedUser;
        receiver: InsertedUser;
    };
}


let mongoDbApi: MongoDbApi;

/**
 * Inserts a sender and a receiver in the database,
 * to emulate the scenario where some user sends a notification to another user
 */
 const setupDb = async (): Promise<MessageReceivedSetupData> => {
    const sender: InsertedUser = await insertUser();
    const receiver: InsertedUser = await insertUser();

    const senderCred: LoginInfo = getCredentialsForUser(sender.userData.username);
    let userArray = [Types.ObjectId(sender.userId), Types.ObjectId(receiver.userId)];
    let userChat = await mongoDbApi.insertChat({ users: userArray, messages: [] });

    TestBed.configureTestingModule(socketIoTestbedConfig);
    receiverClient = TestBed.inject(Socket);

    // Authenticate with the sender to make the add notification request
    senderJwtProvider = await authenticate(senderCred);

    return {
        apiAuthCredentials: senderCred,
        insertedData: {
            chatId: userChat.insertedId,
            sender: sender,
            receiver: receiver,
        },
    };
};

/**
 * Deletes the two users created in the setup (sender, receiver)
 * @param setupData
 */
const teardownDb = async (setupData: MessageReceivedSetupData): Promise<void> => {
    const { chatId, sender, receiver } = setupData.insertedData;
    await deleteChat(chatId)
    await deleteUser(sender.userId);
    await deleteUser(receiver.userId);
    receiverClient.disconnect();
};


let receiverClient: Socket;
let senderJwtProvider: JwtProvider;
let setupData: MessageReceivedSetupData;


describe('Message Received', () => {
    beforeEach(async () => {
        setupData = await setupDb();
    });

    afterEach(async () => {
        await teardownDb(setupData);
    });

    test('New Message Should Correctly Fire Message Received Event', (done) => {
        const { receiver } = setupData.insertedData;

        // Join the server with the receiver, so that it can listen to the
        // notification received event
        joinServer(receiver.userId, receiverClient);
        // add join chat
        joinChat(setupData.insertedData.chatId, receiverClient)

        const messageListener: ChatMessageListener = new ChatMessageListener(
            receiverClient
        )

        messageListener.listen((eventData: ChatMessage) => {
            // The message data should be equal to the removed message
            expect(eventData.author).toEqual(String);
            expect(eventData.timestamp).toEqual(Number);
            expect(eventData.content).toEqual(String)

            // End only after having listened to the event
            done();
        });

        // Send the message
        sendMessage(senderJwtProvider, setupData.insertedData.chatId);
    });

    test('Event Name Should Be "notification-received"', () => {
        const messageListener: ChatMessageListener =
            new ChatMessageListener(receiverClient);

        expect(messageListener.eventName).toEqual('chat-message');
    });
});