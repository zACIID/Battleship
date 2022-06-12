import { HttpClient } from '@angular/common/http';

import { ChatApi } from '../../src/app/core/api/handlers/chat-api';
import { JwtProvider } from '../../src/app/core/api/jwt-auth/jwt-provider';
import { authenticate } from '../fixtures/authentication';
import { injectHttpClient } from '../fixtures/http-client';
import {
    ChatApiTestingSetupData,
    setupDbChatApiTesting,
    teardownDbChatApiTesting,
} from '../fixtures/database/chats';
import { Chat } from '../../src/app/core/model/chat/chat';
import { Message } from '../../src/app/core/model/chat/message';
import { deleteUser, InsertedUser, insertUser } from '../fixtures/database/users';

let httpClient: HttpClient;
let setupData: ChatApiTestingSetupData;
let jwtProvider: JwtProvider;
const wrongChatId: string = 'wrong-chat-id';

beforeEach(async () => {
    httpClient = injectHttpClient();
    setupData = await setupDbChatApiTesting();

    jwtProvider = await authenticate(setupData.apiAuthCredentials);
});

afterEach(async () => {
    await teardownDbChatApiTesting(setupData);
});

describe('Get Chat', () => {
    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const chatApi: ChatApi = new ChatApi(httpClient, jwtProvider);
        const { chat } = setupData.insertedData;

        chatApi.getChat(chat.chatId).subscribe({
            next: (chat: Chat) => {
                // Expect non-empty response
                expect(chat).toBeTruthy();

                // Expect an object with the correct fields
                expect(chat).toEqual(
                    expect.objectContaining<Chat>({
                        chatId: expect.any(String),
                        messages: expect.any(Array),
                        users: expect.any(Array),
                    })
                );
            },
            complete: () => {
                done();
            },
        });
    });

    test('Should Throw', (done) => {
        const chatApi: ChatApi = new ChatApi(httpClient, jwtProvider);

        chatApi.getChat(wrongChatId).subscribe({
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

describe('Delete Chat', () => {
    test('Should Not Throw', (done) => {
        const chatApi: ChatApi = new ChatApi(httpClient, jwtProvider);
        const { chat } = setupData.insertedData;

        // Test should run without exceptions
        chatApi.deleteChat(chat.chatId).subscribe({
            complete: () => {
                done();
            },
        });
    });

    test('Should Throw', (done) => {
        const chatApi: ChatApi = new ChatApi(httpClient, jwtProvider);

        chatApi.deleteChat(wrongChatId).subscribe({
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

describe('Get Messages', () => {
    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const chatApi: ChatApi = new ChatApi(httpClient, jwtProvider);
        const { chat } = setupData.insertedData;

        chatApi.getMessages(chat.chatId, 0, 10).subscribe({
            next: (messages: Message[]) => {
                // Expect non-empty response
                expect(messages).toBeTruthy();

                // Expect an object with the correct fields
                messages.forEach((m: Message) => {
                    expect(m).toEqual(
                        expect.objectContaining<Message>({
                            author: expect.any(String),
                            timestamp: expect.any(Date),
                            content: expect.any(String),
                        })
                    );
                });
            },
            complete: () => {
                done();
            },
        });
    });

    test('Messages Should Throw', (done) => {
        const chatApi: ChatApi = new ChatApi(httpClient, jwtProvider);

        chatApi.getMessages(wrongChatId).subscribe({
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

describe('Add Message', () => {
    let messageStub: Message;

    beforeEach(() => {
        messageStub = {
            author: setupData.insertedData.user.userId,
            timestamp: new Date(),
            content: 'some message',
        };
    });

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const chatApi: ChatApi = new ChatApi(httpClient, jwtProvider);
        const { chat } = setupData.insertedData;

        chatApi.addMessage(chat.chatId, messageStub).subscribe({
            next: (newMessage: Message) => {
                // Expect non-empty response
                expect(newMessage).toBeTruthy();

                // Expect an object with the correct fields
                expect(newMessage).toEqual(
                    expect.objectContaining<Message>({
                        author: expect.any(String),
                        timestamp: expect.any(Date),
                        content: expect.any(String),
                    })
                );
            },
            complete: () => {
                done();
            },
        });
    });

    test('Should Throw', (done) => {
        const chatApi: ChatApi = new ChatApi(httpClient, jwtProvider);

        chatApi.addMessage(wrongChatId, messageStub).subscribe({
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

describe('Add User', () => {
    let newUser: InsertedUser;

    beforeEach(async () => {
        newUser = await insertUser();
    });

    afterEach(async () => {
        await deleteUser(newUser.userId);
    });

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const chatApi: ChatApi = new ChatApi(httpClient, jwtProvider);
        const { chat } = setupData.insertedData;

        chatApi.addUser(chat.chatId, newUser.userId).subscribe({
            next: (resUserId: string) => {
                // Expect non-empty response
                expect(resUserId).toBeTruthy();

                // Expect the same userId that was added
                expect(resUserId).toEqual(newUser.userId);
            },
            complete: () => {
                done();
            },
        });
    });

    test('Should Throw', (done) => {
        const chatApi: ChatApi = new ChatApi(httpClient, jwtProvider);
        const { user } = setupData.insertedData;

        chatApi.addUser(wrongChatId, user.userId).subscribe({
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

describe('Remove User', () => {
    test('Should Not Throw', (done) => {
        const chatApi: ChatApi = new ChatApi(httpClient, jwtProvider);
        const { user, chat } = setupData.insertedData;

        chatApi.removeUser(chat.chatId, user.userId).subscribe({
            complete: () => {
                done();
            },
        });
    });

    test('Should Throw', (done) => {
        const chatApi: ChatApi = new ChatApi(httpClient, jwtProvider);
        const { user } = setupData.insertedData;

        chatApi.removeUser(wrongChatId, user.userId).subscribe({
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
