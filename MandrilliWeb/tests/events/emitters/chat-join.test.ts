import { TestBed } from '@angular/core/testing';
import { Socket } from 'ngx-socket-io';

import { socketIoTestbedConfig, joinChat, leaveChat } from '../../fixtures/socket-io-client';
import { ChatJoinedEmitter } from '../../../src/app/core/events/emitters/chat-joined';
import { ChatLeftEmitter } from '../../../src/app/core/events/emitters/chat-left';
import { deleteChat, insertChat, InsertedChat } from '../../fixtures/database/chats';

let client: Socket;
let chatIdToJoin: string;

/**
 * Inserts in the db the user to join the server with
 */
const setupDb = async () => {
    const insertedChat: InsertedChat = await insertChat();
    chatIdToJoin = insertedChat.chatId;
};

/**
 * Deletes the inserted user from the db
 */
const teardownDb = async () => {
    await deleteChat(chatIdToJoin);
};

const testSetup = async () => {
    TestBed.configureTestingModule(socketIoTestbedConfig);
    client = TestBed.inject(Socket);

    await setupDb();
};

const testTeardown = async () => {
    client.disconnect();

    await teardownDb();
};

describe('Join Chat', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown();
    });

    test('Should Not Throw', () => {
        joinChat(chatIdToJoin, client);
    });

    test('Event Name Should Be "chat-joined"', () => {
        const chatJoinedEmitter: ChatJoinedEmitter = new ChatJoinedEmitter(client);

        expect(chatJoinedEmitter.eventName).toEqual('chat-joined');
    });
});

describe('Join And Leave Chat', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown();
    });

    test('Should Not Throw', () => {
        joinChat(chatIdToJoin, client);

        leaveChat(chatIdToJoin, client);
    });

    test('Event Name Should Be "chat-left"', () => {
        const chatLeftEmitter: ChatLeftEmitter = new ChatLeftEmitter(client);

        expect(chatLeftEmitter.eventName).toEqual('chat-left');
    });
});
