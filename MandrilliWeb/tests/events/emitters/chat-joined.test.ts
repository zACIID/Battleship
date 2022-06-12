import { ChatJoinedEmitter } from '../../../src/app/core/events/emitters/chat-joined';
import { injectSocketIoClient } from '../fixtures/socket.io';
import { Socket } from 'ngx-socket-io';

let client: Socket;

beforeEach(() => {
    client = injectSocketIoClient();
});

describe('Chat Joined Emitter', () => {
    test('Should Not Throw', () => {
        const chatJoinedEmitter: ChatJoinedEmitter = new ChatJoinedEmitter(client);
        chatJoinedEmitter.emit({
            chatId: 'any-chat-id',
        });
    });

    test('Event Name Should Be "chat-joined"', () => {
        const chatJoinedEmitter: ChatJoinedEmitter = new ChatJoinedEmitter(client);
        expect(chatJoinedEmitter.eventName).toBe('chat-joined');
    });
});
