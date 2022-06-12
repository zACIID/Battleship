import { Socket } from 'ngx-socket-io';

import { injectSocketIoClient, joinChat, leaveChat } from '../../fixtures/socket-io-client';
import { ChatJoinedEmitter } from '../../../src/app/core/events/emitters/chat-joined';
import { ChatLeftEmitter } from '../../../src/app/core/events/emitters/chat-left';

let client: Socket;

// It should work with any string, since the chatId required is really
// just an identifier for the socket.io server room.
const chatIdToJoin: string = 'any-chat-id';

beforeEach(() => {
    client = injectSocketIoClient();
});

describe('Join Chat', () => {
    test('Should Not Throw', () => {
        joinChat(chatIdToJoin, client);
    });

    test('Event Name Should Be "chat-joined"', () => {
        const chatJoinedEmitter: ChatJoinedEmitter = new ChatJoinedEmitter(client);

        expect(chatJoinedEmitter.eventName).toBe('chat-joined');
    });
});

describe('Join And Leave Chat', () => {
    test('Should Not Throw', () => {
        joinChat(chatIdToJoin, client);

        leaveChat(chatIdToJoin, client);
    });

    test('Event Name Should Be "chat-left"', () => {
        const chatLeftEmitter: ChatLeftEmitter = new ChatLeftEmitter(client);

        expect(chatLeftEmitter.eventName).toBe('chat-left');
    });
});
