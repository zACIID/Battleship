import { HttpClient } from '@angular/common/http';

import { apiAuthPassword, getCredentialsForUser } from '../fixtures/authentication';
import { JwtProvider } from '../../src/app/core/api/jwt-auth/jwt-provider';
import { authenticate } from '../fixtures/authentication';
import { injectHttpClient } from '../fixtures/http-client';
import { deleteUser, InsertedUser, insertUser } from '../fixtures/database/users';
import { insertModerator } from '../fixtures/database/moderator';
import { ModeratorApi } from '../../src/app/core/api/handlers/moderator-api';
import { User, UserStatus } from '../../src/app/core/model/user/user';
import { LoginInfo } from '../../src/app/core/api/handlers/auth-api';

let httpClient: HttpClient;
let moderator: InsertedUser;
let jwtProviderModerator: JwtProvider;
let jwtProviderFakeModerator: JwtProvider;
let fakeModerator: InsertedUser;
let usefulUser1: InsertedUser;
let usefulUser2: InsertedUser;

beforeEach(async () => {
    httpClient = injectHttpClient();

    moderator = await insertModerator();
    fakeModerator = await insertUser();

    usefulUser1 = await insertUser();
    usefulUser2 = await insertUser();

    const modCred: LoginInfo = getCredentialsForUser(moderator.userData.username);
    jwtProviderModerator = await authenticate(modCred);

    const fakeModCred: LoginInfo = getCredentialsForUser(fakeModerator.userData.username);
    jwtProviderFakeModerator = await authenticate(fakeModCred);
});

afterEach(async () => {
    await deleteUser(moderator.userId);
    await deleteUser(fakeModerator.userId);
});

describe('Add Moderator', () => {
    let newMod: User;

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const modApi: ModeratorApi = new ModeratorApi(httpClient, jwtProviderModerator);
        let newMod: User;

        modApi.addModerator({ username: 'Huentas', password: apiAuthPassword }).subscribe({
            next: (user: User) => {
                // Save for teardown
                newMod = user;

                // Expect non-empty response
                expect(user).toBeTruthy();

                // Expect an object with the correct fields
                expect(user).toEqual(
                    expect.objectContaining<User>({
                        userId: expect.any(String),
                        username: expect.any(String),
                        roles: expect.any(Array),
                        status: expect.any(String),
                        elo: expect.any(Number),
                    })
                );
            },
            complete: async () => {
                // Teardown new mod
                await deleteUser(newMod.userId);

                done();
            },
        });
    });

    test('Should Throw - No Moderator Privileges', (done) => {
        const modApi: ModeratorApi = new ModeratorApi(httpClient, jwtProviderFakeModerator);

        modApi.addModerator({ username: 'Huentas', password: apiAuthPassword }).subscribe({
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
    test('Should Return Empty Response', (done) => {
        const modApi: ModeratorApi = new ModeratorApi(httpClient, jwtProviderModerator);

        modApi.banUser(usefulUser1.userData.username).subscribe({
            next: () => {},
            complete: () => {
                done();
            },
        });
    });

    test('Should Throw - No Moderator Privileges', (done) => {
        const modApi: ModeratorApi = new ModeratorApi(httpClient, jwtProviderFakeModerator);

        modApi.banUser(usefulUser2.userData.username).subscribe({
            error: (err: Error) => {
                expect(err).toBeTruthy();
                done();
            },
            complete: () => {
                throw Error('Observable should not complete without throwing');
            },
        });
    });

    test('Should Throw - User To Ban Does Not Exist', (done) => {
        const modApi: ModeratorApi = new ModeratorApi(httpClient, jwtProviderModerator);
        modApi.banUser('Non existing username').subscribe({
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
