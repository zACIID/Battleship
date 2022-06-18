import { TestBed } from '@angular/core/testing';
import { Socket } from 'ngx-socket-io';

import { deleteUser, InsertedUser, insertUser } from '../../fixtures/database/users';
import { authenticate, getCredentialsForUser } from '../../fixtures/authentication';
import { joinChat, joinServer, socketIoTestbedConfig } from '../../fixtures/socket-io-client';
import { LoginInfo } from '../../../src/app/core/api/handlers/auth-api';
import { JwtProvider } from '../../../src/app/core/api/jwt-auth/jwt-provider';
import { SetupData } from '../../fixtures/utils';
import { ChatMessageListener } from '../../../src/app/core/events/listeners/chat-message';
import { sendMessage } from '../../fixtures/api-utils/messages';
import { MongoDbApi } from '../../fixtures/database/mongodb-api/mongodb-api';
import { deleteChat, insertChat, InsertedChat } from '../../fixtures/database/chats';
import { Message } from '../../../src/app/core/model/chat/message';
import { ApiMessage } from '../../../src/app/core/model/api/chat/api-message';

export interface MessageReceivedSetupData extends SetupData {
    insertedData: {
        chatId: string;
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
    const chatUserIds = [sender.userId, receiver.userId];
    const userChat: InsertedChat = await insertChat(chatUserIds);

    TestBed.configureTestingModule(socketIoTestbedConfig);
    receiverClient = TestBed.inject(Socket);

    // Authenticate with the sender to make the add notification request
    senderJwtProvider = await authenticate(senderCred);

    return {
        apiAuthCredentials: senderCred,
        insertedData: {
            chatId: userChat.chatId,
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
    // Disconnect first, so that the server can tear down the user without problems
    // After this, the user can be deleted
    receiverClient.disconnect();

    const { chatId, sender, receiver } = setupData.insertedData;
    await deleteChat(chatId);
    await deleteUser(sender.userId);
    await deleteUser(receiver.userId);
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
        const { sender, receiver } = setupData.insertedData;

        // Join the server with the receiver, so that it can listen to the
        // notification received event
        joinServer(receiver.userId, receiverClient);
        // add join chat
        joinChat(setupData.insertedData.chatId, receiverClient);

        const messageListener: ChatMessageListener = new ChatMessageListener(receiverClient);
        messageListener.listen((eventData: ApiMessage) => {
            // The message data should be equal to the removed message
            expect(eventData.author).toEqual(expect.any(String));
            expect(eventData.timestamp).toEqual(expect.any(Number));
            expect(eventData.content).toEqual(expect.any(String));

            // End only after having listened to the event
            done();
        });

        // Send the message
        const newMessage: Message = {
            author: sender.userId,
            timestamp: new Date(),
            content: 'content',
        };
        sendMessage(senderJwtProvider, setupData.insertedData.chatId, newMessage);
    });

    test('Event Name Should Be "notification-received"', () => {
        const messageListener: ChatMessageListener = new ChatMessageListener(receiverClient);

        expect(messageListener.eventName).toEqual('chat-message');
    });
});
