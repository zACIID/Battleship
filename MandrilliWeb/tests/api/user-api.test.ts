import { HttpClient } from '@angular/common/http';

import { InsertedUser, insertUser, deleteUser } from '../fixtures/database/users';
import { JwtProvider } from '../../src/app/core/api/jwt-auth/jwt-provider';
import { authenticate, getCredentialsForUser } from '../fixtures/authentication';
import { injectHttpClient } from '../fixtures/http-client';
import { LoginInfo } from '../../src/app/core/api/handlers/auth-api';
import { UserApi, UsernameUpdate } from '../../src/app/core/api/handlers/user-api';
import { User } from '../../src/app/core/model/user/user';
import { ApiUserStats } from '../../src/app/core/model/api/user/stats';
import { UserStats } from '../../src/app/core/model/user/stats';
import {
    insertMultipleMatches,
    MatchesSetupData,
    teardownMatches,
} from '../fixtures/database/matches';
import { Match } from 'src/app/core/model/match/match';

let httpClient: HttpClient;
let mainUser: InsertedUser;
let secondUser: InsertedUser;
let jwtProviderMainUser: JwtProvider;
let jwtProviderSecondUser: JwtProvider;
const wrongUserId: string = 'wrong-user-id';
let wrongPassword: string;
let wrongUsername: string;

describe('Get User', () => {
    beforeEach(async () => {
        httpClient = injectHttpClient();
        mainUser = await insertUser();
        const userCred: LoginInfo = getCredentialsForUser(mainUser.userData.username);
        jwtProviderMainUser = await authenticate(userCred);
    });

    afterEach(async () => {
        await deleteUser(mainUser.userId);
    });

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
            complete: () => {
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

describe('Get Multiple Users', () => {
    beforeEach(async () => {
        httpClient = injectHttpClient();
        mainUser = await insertUser();
        secondUser = await insertUser();

        const userCred: LoginInfo = getCredentialsForUser(mainUser.userData.username);
        jwtProviderMainUser = await authenticate(userCred);

        const secondUserCred: LoginInfo = getCredentialsForUser(secondUser.userData.username);
        jwtProviderSecondUser = await authenticate(secondUserCred);
    });

    afterEach(async () => {
        await deleteUser(mainUser.userId);
        await deleteUser(secondUser.userId);
    });

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);

        userApi.getMultipleUsers([mainUser.userId, secondUser.userId]).subscribe({
            next: (users: User[]) => {
                // Expect non-empty response
                expect(users).toBeTruthy();

                // Expect an array of objects with the correct fields
                expect(users).toEqual(expect.any(Array));
                users.forEach((user: User) => {
                    expect(user).toEqual(
                        expect.objectContaining<User>({
                            userId: expect.any(String),
                            username: expect.any(String),
                            roles: expect.any(Array),
                            status: expect.any(String),
                            elo: expect.any(Number),
                        })
                    );
                });
            },
            complete: () => {
                done();
            },
        });
    });

    //empty list
    test('Should Throw - data Inconsistency', (done) => {
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
    test('Should Throw ', (done) => {
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
    beforeEach(async () => {
        httpClient = injectHttpClient();
        mainUser = await insertUser();

        const userCred: LoginInfo = getCredentialsForUser(mainUser.userData.username);
        jwtProviderMainUser = await authenticate(userCred);
    });

    afterEach(async () => {});

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);
        userApi.deleteUser(mainUser.userId).subscribe({
            complete: () => {
                done();
            },
        });
    });

    //wrong userId
    test('Should Throw ', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);
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
    beforeEach(async () => {
        httpClient = injectHttpClient();
        mainUser = await insertUser();

        const userCred: LoginInfo = getCredentialsForUser(mainUser.userData.username);
        jwtProviderMainUser = await authenticate(userCred);
    });

    afterEach(async () => {
        await deleteUser(mainUser.userId);
    });

    test('Should Not Throw', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);
        userApi.updatePassword(mainUser.userId, 'ayo').subscribe({
            complete: () => {
                done();
            },
        });
    });

    //wrong userId
    test('Should Throw - ', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);
        userApi.updatePassword(wrongUserId, 'ayo').subscribe({
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
    test('Should Throw - ', (done) => {
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
    beforeEach(async () => {
        httpClient = injectHttpClient();
        mainUser = await insertUser();

        const userCred: LoginInfo = getCredentialsForUser(mainUser.userData.username);
        jwtProviderMainUser = await authenticate(userCred);
    });

    afterEach(async () => {
        await deleteUser(mainUser.userId);
    });

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);
        const newUsername: string = `ayo-${Date.now()}`;

        userApi.updateUsername(mainUser.userId, newUsername).subscribe({
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
            complete: () => {
                done();
            },
        });
    });

    //wrong userId
    test('Should Throw ', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);
        userApi.updatePassword(wrongUserId, 'ayo').subscribe({
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
    test('Should Throw ', (done) => {
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

describe('Get Matches', () => {
    let jwtProvider: JwtProvider;
    let matchesSetupData: MatchesSetupData;
    beforeEach(async () => {
        httpClient = injectHttpClient();
        matchesSetupData = await insertMultipleMatches(2);
        jwtProvider = await authenticate(matchesSetupData.apiAuthCredentials);
    });

    afterEach(async () => {
        await teardownMatches(matchesSetupData);
    });

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProvider);
        const { matches } = matchesSetupData.insertedData;
        const userId: string = matches[0].playerIds[0];

        userApi.getUserMatches(userId).subscribe({
            next: (matches: Match[]) => {
                // Expect non-empty response
                expect(matches).toBeTruthy();

                // Expect an object with the correct fields
                expect(matches).toEqual(
                    expect.objectContaining<Match[]>([
                        {
                            matchId: expect.any(String),
                            player1: expect.any(Object),
                            player2: expect.any(Object),
                            playersChat: expect.any(String),
                            observersChat: expect.any(Object),
                            stats: expect.any(Object),
                        },
                    ])
                );
            },
            complete: () => {
                done();
            },
        });
    });

    //wrong Userid
    test('Should Throw', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProvider);
        userApi.getUserMatches(wrongUserId).subscribe({
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

describe('Get Stats', () => {
    beforeEach(async () => {
        httpClient = injectHttpClient();
        mainUser = await insertUser();

        const modCred: LoginInfo = getCredentialsForUser(mainUser.userData.username);
        jwtProviderMainUser = await authenticate(modCred);
    });

    afterEach(async () => {
        await deleteUser(mainUser.userId);
    });

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);

        userApi.getStats(mainUser.userId).subscribe({
            next: (userStats: UserStats) => {
                // Expect non-empty response
                expect(userStats).toBeTruthy();

                // Expect an object with the correct fields
                expect(userStats).toEqual(
                    expect.objectContaining<UserStats>({
                        elo: expect.any(Number),
                        topElo: expect.any(Number),
                        wins: expect.any(Number),
                        losses: expect.any(Number),
                        shipsDestroyed: expect.any(Number),
                        totalShots: expect.any(Number),
                        totalHits: expect.any(Number),
                        rank: expect.any(String),
                    })
                );
            },
            complete: () => {
                done();
            },
        });
    });

    //wrong userId
    test('Should Throw ', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);

        userApi.getStats(wrongUserId).subscribe({
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

describe('Update User Stats', () => {
    beforeEach(async () => {
        httpClient = injectHttpClient();
        mainUser = await insertUser();
        const modCred: LoginInfo = getCredentialsForUser(mainUser.userData.username);
        jwtProviderMainUser = await authenticate(modCred);
    });

    afterEach(async () => {
        await deleteUser(mainUser.userId);
    });

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);
        userApi
            .updateStats(mainUser.userId, {
                elo: 0,
                topElo: 0,
                wins: 0,
                losses: 0,
                shipsDestroyed: 0,
                totalShots: 0,
                totalHits: 0,
            })
            .subscribe({
                next: (userStats: ApiUserStats) => {
                    // Expect non-empty response
                    expect(userStats).toBeTruthy();

                    // Expect an object with the correct fields
                    expect(userStats).toEqual(
                        expect.objectContaining<ApiUserStats>({
                            elo: expect.any(Number),
                            topElo: expect.any(Number),
                            wins: expect.any(Number),
                            losses: expect.any(Number),
                            shipsDestroyed: expect.any(Number),
                            totalShots: expect.any(Number),
                            totalHits: expect.any(Number),
                        })
                    );
                },
                complete: () => {
                    done();
                },
            });
    });

    //wrong userId
    test('Should Throw', (done) => {
        const userApi: UserApi = new UserApi(httpClient, jwtProviderMainUser);
        userApi
            .updateStats(wrongUserId, {
                elo: 0,
                topElo: 0,
                wins: 0,
                losses: 0,
                shipsDestroyed: 0,
                totalShots: 0,
                totalHits: 0,
            })
            .subscribe({
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
