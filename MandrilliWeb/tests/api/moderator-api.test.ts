import { HttpClient } from '@angular/common/http';
import { apiAuthPassword } from '../api/fixtures/authentication'
import { ChatApi } from '../../src/app/core/api/handlers/chat-api';
import { AuthApi } from '../../src/app/core/api/handlers/auth-api';
import { JwtProvider } from '../../src/app/core/api/jwt-auth/jwt-provider';
import { authenticate } from './fixtures/authentication';
import { injectHttpClient } from './fixtures/http-client';
import {
    ChatApiTestingSetupData,
    setupDbChatApiTesting,
    teardownDbChatApiTesting,
} from './fixtures/database/chats';
import { Chat } from '../../src/app/core/model/chat/chat';
import { Message } from '../../src/app/core/model/chat/message';
import { deleteUser, InsertedUser, insertUser } from './fixtures/database/users';
import { insertModerator } from './fixtures/database/moderator';
import { ModeratorApi } from 'src/app/core/api/handlers/moderator-api';
import { User, UserStatus } from 'src/app/core/model/user/user';



let httpClient: HttpClient;
let moderator: InsertedUser;
let jwtProviderModerator: JwtProvider;
let jwtProviderFakeModerator: JwtProvider;
let fakeModerator: InsertedUser;
let usefullUser1: InsertedUser;
let usefullUser2: InsertedUser;

beforeEach(async () => {
    httpClient = injectHttpClient();
    moderator = await insertModerator();
    const authApi: AuthApi = new AuthApi(httpClient);
    fakeModerator = await insertUser()
    usefullUser1 = await insertUser()
    usefullUser2 = await insertUser()
    jwtProviderFakeModerator = await authenticate(authApi, 
        {username: fakeModerator.userData.username, password: apiAuthPassword})
    jwtProviderModerator = await authenticate(authApi, 
        {username: moderator.userData.username, password: apiAuthPassword}
    );
});

afterEach(async () => {
    await deleteUser(moderator.userId);
    await deleteUser(fakeModerator.userId)
});

describe('Add Moderator', () => {
    test('AddModerator Should Return Non-Empty Response With Correct Fields', (done) => {
        const modApi: ModeratorApi = new ModeratorApi(httpClient, jwtProviderModerator);

        modApi.addModerator({username: "Huentas", password: apiAuthPassword})
        .subscribe({
            next: (user: User) => {
                // Expect non-empty response
                expect(user).toBeTruthy();

                // Expect an object with the correct fields
                expect(user).toEqual(
                    expect.objectContaining<User>({
                        userId: expect.any(String),
                        username: expect.any(String),
                        roles: expect.any([String]),
                        status: expect.any(UserStatus),
                        elo: expect.any(Number),
                    })
                );
            },
            complete: () => {
                done();
            },
        });
    });

    test('Add moderator Should Throw', (done) => {
        const modApi: ModeratorApi = new ModeratorApi(httpClient, jwtProviderFakeModerator);

        modApi.addModerator({username: "Huentas", password: apiAuthPassword}).subscribe({
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


describe('BanUser', () => {
    test('BanUserShould Return Non-Empty Response With Correct Fields', (done) => {
        const modApi: ModeratorApi = new ModeratorApi(httpClient, jwtProviderModerator);
        modApi.banUser(usefullUser1.userData.username)
        .subscribe({
            next: () => {},
            complete: () => {
                done();
            },
        });
    });

    test('BanUser Should Throw', (done) => {
        const modApi: ModeratorApi = new ModeratorApi(httpClient, jwtProviderFakeModerator);
        modApi.banUser(usefullUser2.userData.username).subscribe({
            error: (err: Error) => {
                expect(err).toBeTruthy();

                done();
            },
            complete: () => {
                throw Error('Observable should not complete without throwing');
            },
        });
    });

    test('BanUser Should Throw 2', (done) => {
        const modApi: ModeratorApi = new ModeratorApi(httpClient, jwtProviderModerator);
        modApi.banUser("Non existing username").subscribe({
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
