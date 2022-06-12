import { HttpClient } from '@angular/common/http';
import { JwtProvider } from '../../src/app/core/api/jwt-auth/jwt-provider';
import { apiAuthPassword, authenticate } from '../fixtures/authentication';
import { injectHttpClient } from '../fixtures/http-client';
import { InsertedUser, insertUser } from '../fixtures/database/users'
import { 
        UserMatches, 
        teardownDbMatchApiTesting, 
        createNMatch
} from '../fixtures/database/matches'
import { MatchApi } from 'src/app/core/api/handlers/match-api';
import { Match } from 'src/app/core/model/match/match';
import { PlayerState } from 'src/app/core/model/match/player-state';
import { MatchStats } from 'src/app/core/model/match/match-stats';
import { Shot } from 'src/app/core/model/api/match/shot';
import { GridCoordinates } from 'src/app/core/model/match/coordinates';
import { BattleshipGrid } from 'src/app/core/model/match/battleship-grid';
import { Ship } from 'src/app/core/model/match/ship';


interface MatchStatsUpdate {
    /**
     * Id of player that won the match
     */
    winner: string;

    /**
     * Time (in unix seconds) that the match ended at
     */
    endTime: number;

    /**
     * Total shots fired during the match
     */
    totalShots: number;

    /**
     * Number of ships destroyed during the match
     */
    totalHits: number;
}

let httpClient: HttpClient;
let setupData: UserMatches
let userWithNoMatch: InsertedUser;
let jwtProvider: JwtProvider;
let jwtProviderUser0Matches: JwtProvider;
let wrongMatchId: string = "bro"
let wrongUserId: string = "bro"
let wrongState: boolean
let matchStats: MatchStatsUpdate
let shot: Shot
let gridUpdate: BattleshipGrid = {
    ships: [{
        coordinates:[{
            row:0,
            col:0
        }, {
            row:0,
            col:1
        }, {
            row:0,
            col:2
        }],
        type: "cruiser"
    }],
    shotsReceived: [{
        row: 0,
        col: 1
    }]
}



beforeEach(async () => {
    httpClient = injectHttpClient()

    setupData = await createNMatch()

    userWithNoMatch = await insertUser()
    
    jwtProvider = await authenticate({
        username: setupData.userInfo.username,
        password: apiAuthPassword
    });
    jwtProviderUser0Matches = await authenticate({
        username: userWithNoMatch.userData.username,
        password: apiAuthPassword
    });
});

afterEach(async () => {
    await teardownDbMatchApiTesting();
});

describe('Get Match', () => {
    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);
   
        matchApi.getMatch(setupData.matchIds[0]).subscribe({
            next: (match: Match) => {
                // Expect non-empty response
                expect(match).toBeTruthy();

                // Expect an object with the correct fields
                expect(match).toEqual(
                    expect.objectContaining<Match>({
                        matchId: expect.any(String),
                        player1: expect.any(PlayerState),
                        player2: expect.any(PlayerState),
                        playersChat: expect.any(String),
                        observersChat: expect.any(PlayerState),
                        stats: expect.any(MatchStats)
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


describe('Get Matches', () => {
    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);
   
        matchApi.getUserMatches(setupData.userInfo.userId).subscribe({
            next: (matches: Match[]) => {
                // Expect non-empty response
                expect(matches).toBeTruthy();

                // Expect an object with the correct fields
                expect(matches).toEqual(
                    expect.objectContaining<Match[]>([{
                        matchId: expect.any(String),
                        player1: expect.any(PlayerState),
                        player2: expect.any(PlayerState),
                        playersChat: expect.any(String),
                        observersChat: expect.any(PlayerState),
                        stats: expect.any(MatchStats)
                    }])
                );
            },
            complete: () => {
                done();
            },
        });
    });

    //wrong Userid
    test('Should Throw', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);

        matchApi.getUserMatches(wrongUserId).subscribe({
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
    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);
   
        matchApi.setReadyState(setupData.matchIds[0], setupData.userInfo.userId, true)
        .subscribe({
            next: (res: {ready: boolean}) => {
                // Expect non-empty response
                expect(res).toBeTruthy();

                // Expect an object with the correct fields
                expect(res).toEqual(
                    expect.objectContaining<{ready: boolean}>({
                        ready: expect.any(Boolean),
                    })
                );
            },
            complete: () => {
                done();
            },
        });
    });

    // wrong matchId
    test('Should Throw', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);

        matchApi.setReadyState(wrongMatchId, setupData.userInfo.userId, true).subscribe({
            error: (err: Error) => {
                expect(err).toBeTruthy();
                done();
            },
            complete: () => {
                throw Error('Observable should not complete without throwing');
            },
        });
    });

    // wrong userId (non existing)
    test('Should Throw', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);

        matchApi.setReadyState(setupData.matchIds[0], wrongUserId, true).subscribe({
            error: (err: Error) => {
                expect(err).toBeTruthy();
                done();
            },
            complete: () => {
                throw Error('Observable should not complete without throwing');
            },
        });
    });

    // wrong userId (with no match)
    test('Should Throw', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProviderUser0Matches);

        matchApi.setReadyState(setupData.matchIds[0], userWithNoMatch.userId, true).subscribe({
            error: (err: Error) => {
                expect(err).toBeTruthy();
                done();
            },
            complete: () => {
                throw Error('Observable should not complete without throwing');
            },
        });
    });


    // wrong readystate 
    test('Should Throw', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);

        matchApi.setReadyState(setupData.matchIds[0], setupData.userInfo.userId, wrongState).subscribe({
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

describe('UpdateStats', () => {
    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);
        matchStats = {
            winner: (setupData.userInfo.username).toString(),
            endTime: 0,
            totalShots: 0,
            totalHits: 0
        }
        matchApi.updateStats(setupData.matchIds[0], matchStats).subscribe({
            next: (matchStats: MatchStatsUpdate) => {
                // Expect non-empty response
                expect(matchStats).toBeTruthy();

                // Expect an object with the correct fields
                expect(matchStats).toEqual(
                    expect.objectContaining<MatchStatsUpdate>({
                        winner: expect.any(String),
                        endTime: expect.any(Number),
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

    //wrong match
    test('Should Throw', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);
        matchStats = {
            winner: "" + (setupData.userInfo.username),
            endTime: 0,
            totalShots: 0,
            totalHits: 0
        }
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
        matchApi.updateStats(setupData.matchIds[0], matchStats).subscribe({
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

describe('fireShot', () => {
    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);
        shot = {
            playerId: setupData.userInfo.userId,
            coordinates: {
                row: 0,
                col: 0
            }
        }
        matchApi.fireShot(setupData.matchIds[0], shot).subscribe({
            next: (shot: Shot) => {
                // Expect non-empty response
                expect(shot).toBeTruthy();

                // Expect an object with the correct fields
                expect(shot).toEqual(
                    expect.objectContaining<Shot>({
                        playerId: expect.any(String),
                        coordinates: expect.any(GridCoordinates)
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
        shot = {
            playerId: setupData.userInfo.userId,
            coordinates: {
                row: 0,
                col: 0
            }
        }
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

    
    //wrong shot
    test('Should Throw', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);
        matchApi.fireShot(setupData.matchIds[0], shot).subscribe({
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


describe('updatePlayerGrid', () => {
    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);
        matchApi.updatePlayerGrid(setupData.matchIds[0], setupData.userInfo.userId, gridUpdate).subscribe({
            next: (ship: Ship) => {
                // Expect non-empty response
                expect(ship).toBeTruthy();

                // Expect an object with the correct fields
                expect(ship).toEqual(
                    expect.objectContaining<Ship>({
                        coordinates: expect.any(GridCoordinates),
                        type: expect.any(String)
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
        matchApi.updatePlayerGrid(wrongMatchId, setupData.userInfo.userId, gridUpdate).subscribe({
            error: (err: Error) => {
                expect(err).toBeTruthy();
                done();
            },
            complete: () => {
                throw Error('Observable should not complete without throwing');
            },
        });
    });

    
    //wrong user
    test('Should Throw', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);
        matchApi.updatePlayerGrid(setupData.matchIds[0], wrongUserId, gridUpdate).subscribe({
            error: (err: Error) => {
                expect(err).toBeTruthy();
                done();
            },
            complete: () => {
                throw Error('Observable should not complete without throwing');
            },
        });
    });

    //wrong update
    test('Should Throw', (done) => {
        const matchApi: MatchApi = new MatchApi(httpClient, jwtProvider);
        matchApi.updatePlayerGrid(setupData.matchIds[0], setupData.userInfo.userId, {ships: gridUpdate.ships, shotsReceived: [{row: 20, col:20}]}).subscribe({
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