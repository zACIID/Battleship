import { HttpClient } from '@angular/common/http';

import { JwtProvider } from '../../src/app/core/api/jwt-auth/jwt-provider';
import { authenticate, getCredentialsForUser } from '../fixtures/authentication';
import { injectHttpClient } from '../fixtures/http-client';
import { deleteUser, InsertedUser, insertUser } from '../fixtures/database/users';
import {
    MatchesSetupData,
    insertMultipleMatches,
    teardownMatches,
} from '../fixtures/database/matches';
import { MatchApi } from '../../src/app/core/api/handlers/match-api';
import { Match } from '../../src/app/core/model/match/match';
import { GridCoordinates } from '../../src/app/core/model/match/coordinates';
import { BattleshipGrid } from '../../src/app/core/model/match/battleship-grid';
import { MatchStatsUpdate } from '../../src/app/core/model/api/match/stats-update';
import { Shot } from '../../src/app/core/model/api/match/shot';

let httpClient: HttpClient;
let setupData: MatchesSetupData;
let userWithNoMatch: InsertedUser;
let jwtProvider: JwtProvider;
let jwtProviderUser0Matches: JwtProvider;

const wrongMatchId: string = 'wrong-match-id';
const gridUpdate: BattleshipGrid = {
    ships: [
        {
            coordinates: [
                {
                    row: 0,
                    col: 0,
                },
                {
                    row: 0,
                    col: 1,
                },
                {
                    row: 0,
                    col: 2,
                },
            ],
            type: 'Cruiser',
        },
    ],
    shotsReceived: [
        {
            row: 0,
            col: 1,
        },
    ],
};

const testSetup = async () => {
    httpClient = injectHttpClient();
    setupData = await insertMultipleMatches(2);
    userWithNoMatch = await insertUser();

    jwtProvider = await authenticate(setupData.apiAuthCredentials);

    jwtProviderUser0Matches = await authenticate(
        getCredentialsForUser(userWithNoMatch.userData.username)
    );
};

const testTeardown = async (setupData: MatchesSetupData) => {
    // Delete all the data inserted with the matches and
    // the other user created during the setup
    await teardownMatches(setupData);

    await deleteUser(userWithNoMatch.userId);
};

describe('Get Match', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown(setupData);
    });

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);

        const { insMatches } = setupData.insertedData;
        matchApi.getMatch(insMatches[0].matchId).subscribe({
            next: (match: Match) => {
                // Expect non-empty response
                expect(match).toBeTruthy();

                // Expect an object with the correct fields
                expect(match).toEqual(
                    expect.objectContaining<Match>({
                        matchId: expect.any(String),
                        player1: expect.any(Object),
                        player2: expect.any(Object),
                        playersChat: expect.any(String),
                        observersChat: expect.any(String),
                        stats: expect.any(Object),
                    })
                );
            },
            complete: () => {
                done();
            },
        });
    });

    //wrong matchid
    test('Should Throw', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);

        matchApi.getMatch(wrongMatchId).subscribe({
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

describe('Set Ready', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown(setupData);
    });

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);
        const newState: boolean = true;
        const { insMatches } = setupData.insertedData;

        matchApi
            .setReadyState(insMatches[0].matchId, insMatches[0].playerIds[0], newState)
            .subscribe({
                next: (ready: boolean) => {
                    // Expect non-empty response
                    expect(ready).toEqual(newState);
                },
                complete: () => {
                    done();
                },
            });
    });

    // wrong matchId
    test('Should Throw', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);

        const { insMatches } = setupData.insertedData;
        matchApi.setReadyState(wrongMatchId, insMatches[0].playerIds[0], true).subscribe({
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

describe('Update Stats', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown(setupData);
    });

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);
        const { insMatches } = setupData.insertedData;

        const matchStats: MatchStatsUpdate = {
            winner: insMatches[0].playerIds[0],
            endTime: 0,
            totalShots: 0,
            shipsDestroyed: 0,
        };
        matchApi.updateStats(insMatches[0].matchId, matchStats).subscribe({
            next: (matchStats: MatchStatsUpdate) => {
                // Expect non-empty response
                expect(matchStats).toBeTruthy();

                // Expect an object with the correct fields
                expect(matchStats).toEqual(
                    expect.objectContaining<MatchStatsUpdate>({
                        winner: expect.any(String),
                        endTime: expect.any(Number),
                        totalShots: expect.any(Number),
                        shipsDestroyed: expect.any(Number),
                    })
                );
            },
            complete: () => {
                done();
            },
        });
    });

    //wrong match
    test('Should Throw', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);
        const { insMatches } = setupData.insertedData;

        const matchStats: MatchStatsUpdate = {
            winner: insMatches[0].playerIds[0],
            endTime: 0,
            totalShots: 0,
            shipsDestroyed: 0,
        };

        matchApi.updateStats(wrongMatchId, matchStats).subscribe({
            error: (err: Error) => {
                expect(err).toBeTruthy();
                done();
            },
            complete: () => {
                throw Error('Observable should not complete without throwing');
            },
        });
    });

    //wrong stats
    test('Should Throw', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);
        const { insMatches } = setupData.insertedData;

        const matchStats: MatchStatsUpdate = {
            winner: insMatches[0].playerIds[0],
            endTime: 0,
            totalShots: 0,
            shipsDestroyed: 0,
        };

        matchApi.updateStats(insMatches[0].matchId, matchStats).subscribe({
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

describe('Fire Shot', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown(setupData);
    });

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);
        const { insMatches } = setupData.insertedData;

        const shot: Shot = {
            playerId: insMatches[0].playerIds[0],
            coordinates: {
                row: 0,
                col: 0,
            },
        };
        matchApi.fireShot(insMatches[0].matchId, shot).subscribe({
            next: (shotCoords: GridCoordinates) => {
                // Expect non-empty response
                expect(shotCoords).toBeTruthy();

                // Expect an object with the correct fields
                expect(shotCoords).toEqual(
                    expect.objectContaining<GridCoordinates>({
                        row: expect.any(Number),
                        col: expect.any(Number),
                    })
                );
            },
            complete: () => {
                done();
            },
        });
    });

    //wrong match
    test('Should Throw', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);
        const { insMatches } = setupData.insertedData;

        const shot: Shot = {
            playerId: insMatches[0].playerIds[0],
            coordinates: {
                row: 0,
                col: 0,
            },
        };
        matchApi.fireShot(wrongMatchId, shot).subscribe({
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

describe('Update Player Grid', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown(setupData);
    });

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);
        const { insMatches } = setupData.insertedData;

        matchApi
            .updatePlayerGrid(insMatches[0].matchId, insMatches[0].playerIds[0], gridUpdate)
            .subscribe({
                next: (grid: BattleshipGrid) => {
                    // Expect non-empty response
                    expect(grid).toBeTruthy();

                    // Expect an object with the correct fields
                    expect(grid).toEqual(
                        expect.objectContaining<BattleshipGrid>({
                            ships: expect.any(Array),
                            shotsReceived: expect.any(Array),
                        })
                    );
                },
                complete: () => {
                    done();
                },
            });
    });

    //wrong match
    test('Should Throw', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);
        const { insMatches } = setupData.insertedData;

        matchApi.updatePlayerGrid(wrongMatchId, insMatches[0].playerIds[0], gridUpdate).subscribe({
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
