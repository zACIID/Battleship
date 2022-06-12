import { InsertedUser, insertUser } from '../fixtures/database/users'
import { HttpClient } from '@angular/common/http';
import { JwtProvider } from '../../src/app/core/api/jwt-auth/jwt-provider';
import { apiAuthPassword, authenticate, getCredentialsForUser } from '../fixtures/authentication';
import { injectHttpClient } from '../fixtures/http-client';
import { LoginInfo } from 'src/app/core/api/handlers/auth-api';
import { deleteUser } from '../../../src/model/user/user';
import { ModeratorApi } from 'src/app/core/api/handlers/moderator-api';
import { UserApi, UsernameUpdate } from 'src/app/core/api/handlers/user-api';
import { User } from 'src/app/core/model/user/user';

let httpClient: HttpClient;
let mainUser: InsertedUser;
let fakeUser: InsertedUser;
let jwtProviderMainUser: JwtProvider;
let jwtProviderFakeUser: JwtProvider;
let jwtProviderUsefullUser: JwtProvider;
let wrongUserId: string = ""
let usefulUser1: InsertedUser;
let wrongPassword: string
let wrongUsername: string

beforeEach(async () => {
    httpClient = injectHttpClient();

    mainUser = await insertUser()
    fakeUser = await insertUser()
    usefulUser1 = await insertUser()

    const modCred: LoginInfo = getCredentialsForUser(mainUser.userData.username);
    jwtProviderMainUser = await authenticate(modCred);

    const fakeModCred: LoginInfo = getCredentialsForUser(fakeUser.userData.username);
    jwtProviderFakeUser = await authenticate(fakeModCred);

    const usefullUserModCred: LoginInfo = getCredentialsForUser(usefulUser1.userData.username);
    jwtProviderUsefullUser = await authenticate(usefullUserModCred);
});

afterEach(async () => {
    deleteUser(mainUser)
    deleteUser(fakeUser)
});


describe('Get User', () => {
    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);
        userApi.getUser(mainUser.userId).subscribe({
            next: (user: User) => {
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
                done();
            },
        });
    });

    //wrong userId
    test('Should Throw - No Moderator Privileges', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);
        userApi.getUser(wrongUserId).subscribe({
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

describe('Get Multiple User', () => {
    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);
        userApi.getMultipleUsers([mainUser.userId, fakeUser.userId]).subscribe({
            next: (users: User[]) => {
                // Expect non-empty response
                expect(users).toBeTruthy();

                // Expect an object with the correct fields
                expect(users).toEqual(
                    expect.objectContaining<User[]>([{
                        userId: expect.any(String),
                        username: expect.any(String),
                        roles: expect.any(Array),
                        status: expect.any(String),
                        elo: expect.any(Number),
                    }])
                );
            },
            complete: async () => {
                done();
            },
        });
    });

    //empty list
    test('Should Throw - No Moderator Privileges', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);
        userApi.getMultipleUsers([]).subscribe({
            error: (err: Error) => {
                expect(err).toBeTruthy();
                done();
            },
            complete: () => {
                throw Error('Observable should not complete without throwing');
            },
        });
    });

    //one wrong parameter
    test('Should Throw - No Moderator Privileges', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);
        userApi.getMultipleUsers([mainUser.userId, wrongUserId]).subscribe({
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

describe('Delete User', () => {
    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderUsefullUser);
        userApi.deleteUser(usefulUser1.userId).subscribe({
            next: (nun: void) => {},
            complete: async () => {
                done();
            },
        });
    });

    //wrong userId
    test('Should Throw - No Moderator Privileges', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderUsefullUser);
        userApi.deleteUser(wrongUserId).subscribe({
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

describe('Update Password', () => {
    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);
        userApi.updatePassword(mainUser.userId, "ayo").subscribe({
            next: (nun: void) => {},
            complete: async () => {
                done();
            },
        });
    });

    //wrong userId
    test('Should Throw - No Moderator Privileges', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);
        userApi.updatePassword(wrongUserId, "ayo").subscribe({
            error: (err: Error) => {
                expect(err).toBeTruthy();
                done();
            },
            complete: () => {
                throw Error('Observable should not complete without throwing');
            },
        });
    });

    //wrong password
    test('Should Throw - No Moderator Privileges', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);
        userApi.updatePassword(mainUser.userId, wrongPassword).subscribe({
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

describe('Update Username', () => {
    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);
        userApi.updateUsername(mainUser.userId, "ayo").subscribe({
            next: (userData: UsernameUpdate) => {
                // Expect non-empty response
                expect(userData).toBeTruthy();

                // Expect an object with the correct fields
                expect(userData).toEqual(
                    expect.objectContaining<UsernameUpdate>({
                        username: expect.any(String),
                    })
                );
            },
            complete: async () => {
                done();
            },
        });
    });

    //wrong userId
    test('Should Throw - No Moderator Privileges', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);
        userApi.updatePassword(wrongUserId, "ayo").subscribe({
            error: (err: Error) => {
                expect(err).toBeTruthy();
                done();
            },
            complete: () => {
                throw Error('Observable should not complete without throwing');
            },
        });
    });

    //wrong username
    test('Should Throw - No Moderator Privileges', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);
        userApi.updatePassword(mainUser.userId, wrongUsername).subscribe({
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

