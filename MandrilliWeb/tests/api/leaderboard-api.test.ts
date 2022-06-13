import { HttpClient } from '@angular/common/http';

import { getCredentialsForUser } from '../fixtures/authentication';
import { JwtProvider } from '../../src/app/core/api/jwt-auth/jwt-provider';
import { authenticate } from '../fixtures/authentication';
import { injectHttpClient } from '../fixtures/http-client';
import { deleteUser, InsertedUser, insertUser } from '../fixtures/database/users';
import { LoginInfo } from '../../src/app/core/api/handlers/auth-api';
import { LeaderboardApi } from '../../src/app/core/api/handlers/leaderboard-api';
import { LeaderboardPage } from '../../src/app/core/model/api/leaderboard/page';
import { LeaderboardEntry } from '../../src/app/core/model/leaderboard/entry';

let httpClient: HttpClient;
let user: InsertedUser;
let jwtProvider: JwtProvider;

const setupTest = async () => {
    httpClient = injectHttpClient();
    user = await insertUser();

    const userCred: LoginInfo = getCredentialsForUser(user.userData.username);
    jwtProvider = await authenticate(userCred);
};

const teardownTest = async () => {
    await deleteUser(user.userId);
};

describe('Get Leaderboard', () => {
    beforeEach(async () => {
        await setupTest();
    });

    afterEach(async () => {
        await teardownTest();
    });

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const leaderboardApi: LeaderboardApi = new LeaderboardApi(httpClient, jwtProvider);

        leaderboardApi.getLeaderboard(0, 50).subscribe({
            next: (page: LeaderboardPage) => {
                // Expect non-empty response
                expect(page).toBeTruthy();

                // Expect an object with the correct fields
                expect(page.leaderboard).toEqual(expect.any(Array));
                expect(page.nextPage).toEqual(expect.any(String));

                page.leaderboard.forEach((entry: LeaderboardEntry) => {
                    expect(entry).toEqual(
                        expect.objectContaining<LeaderboardEntry>({
                            userId: expect.any(String),
                            username: expect.any(String),
                            elo: expect.any(Number),
                        })
                    );
                });
            },
            complete: async () => {
                done();
            },
        });
    });

    test('Should Throw', (done) => {
        const leaderboardApi: LeaderboardApi = new LeaderboardApi(httpClient, jwtProvider);

        leaderboardApi.getLeaderboard(-1, -1).subscribe({
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
