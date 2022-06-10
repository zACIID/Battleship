import { HttpClient } from '@angular/common/http';

import { ChatApi } from '../../src/app/core/api/handlers/chat-api';
import { AuthApi } from '../../src/app/core/api/handlers/auth-api';
import { JwtStorage } from '../../src/app/core/api/jwt-auth/jwt-storage';
import { JwtProvider } from '../../src/app/core/api/jwt-auth/jwt-provider';
import { authenticate, JwtStubProvider } from './fixtures/authentication';
import { injectHttpClient } from './fixtures/http-client';
import {
    ChatApiTestingSetupData,
    setupDbChatApiTesting,
    teardownDbChatApiTesting,
} from './fixtures/database';
import { firstValueFrom, Observable } from 'rxjs';
import { Chat } from '../../src/app/core/model/chat/chat';

describe('Get Chat', () => {
    let httpClient: HttpClient;
    let setupData: ChatApiTestingSetupData;
    let jwtProvider: JwtProvider;

    beforeEach(async () => {
        httpClient = injectHttpClient();
        setupData = await setupDbChatApiTesting();

        const authApi: AuthApi = new AuthApi(httpClient);
        jwtProvider = await authenticate(authApi, setupData.apiAuthCredentials);
    });

    afterEach(async () => {
        await teardownDbChatApiTesting(setupData);
    });

    test('Get Chat Should Return Non-Empty Response With Correct Fields', (done) => {
        const chatApi: ChatApi = new ChatApi(httpClient, jwtProvider);

        // TODO error: jwt malformed
        const chatObs: Observable<Chat> = chatApi.getChat(setupData.insertedData.chatId);
        chatObs.subscribe((chat: Chat) => {
            expect(chat).toBeTruthy();

            expect(chat).toEqual(
                expect.objectContaining<Chat>({
                    chatId: expect.any(String),
                    messages: expect.any(Array),
                    users: expect.any(Array),
                })
            );

            done();
        });
    });

    it('Get Chat Should Throw', () => {
        const chatApi: ChatApi = new ChatApi(httpClient, jwtProvider);

        expect(async () => await firstValueFrom(chatApi.getChat('wrong-chat-id'))).toThrow();
    });
});

it('Delete Chat Should Not Throw', () => {
    // correct request
});

it('Delete Chat Should Throw', () => {
    // wrong request
});

it('Get Messages Should Return Non-Empty Response With Correct Fields', () => {
    // correct request
});

it('Get Messages Should Throw', () => {
    // wrong request
});

it('Add Message Should Return Non-Empty Response With Correct Fields', () => {
    // correct request
});

it('Add Message Should Throw', () => {
    // wrong request
});

it('Add User Should Return Non-Empty Response With Correct Fields', () => {
    // correct request
});

it('Add User Should Throw', () => {
    // wrong request
});

it('Remove User Should Not Throw', () => {
    // correct request
});

it('Remove User Should Throw', () => {
    // wrong request
});
