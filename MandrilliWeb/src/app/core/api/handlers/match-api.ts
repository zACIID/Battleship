import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';

import { BaseAuthenticatedApi } from './base/base-authenticated-api';
import { JwtProvider } from '../jwt-auth/jwt-provider';
import { Match } from '../../model/match/match';
import { BattleshipGrid } from '../../model/match/battleship-grid';
import { MatchStatsUpdate } from '../../model/api/match/stats-update';
import { Shot } from '../../model/api/match/shot';
import { GridCoordinates } from '../../model/match/coordinates';
import { ApiMatch } from '../../model/api/match/match';
import { MatchStats } from '../../model/match/match-stats';
import { ApiMatchStats } from '../../model/api/match/stats';

/**
 * Interface that models the request and response body of a request
 * to change the ready state of a player in a match
 */
export interface StateChangeBody {
    ready: boolean;
}

/**
 * Class that handles communication with match-related endpoints
 */
@Injectable({
    providedIn: 'root',
})
export class MatchApi extends BaseAuthenticatedApi {
    public constructor(httpClient: HttpClient, accessTokenProvider: JwtProvider) {
        super(httpClient, accessTokenProvider);
    }

    public getMatch(matchId: string): Observable<Match> {
        const reqPath: string = `${this.baseUrl}/api/matches/${matchId}`;

        return this.httpClient.get<ApiMatch>(reqPath, this.createRequestOptions()).pipe(
            catchError(this.handleError),
            map<ApiMatch, Match>((apiMatch: ApiMatch) => {
                const apiStats: ApiMatchStats = apiMatch.stats;
                const actualMatchStats: MatchStats = {
                    winner: apiStats.winner,
                    startTime: new Date(apiStats.startTime),
                    endTime: new Date(apiStats.endTime),
                    totalShots: apiStats.totalShots,
                    shipsDestroyed: apiStats.shipsDestroyed,
                };

                return {
                    matchId: apiMatch.matchId,
                    player1: apiMatch.player1,
                    player2: apiMatch.player2,
                    playersChat: apiMatch.playersChat,
                    observersChat: apiMatch.observersChat,
                    stats: actualMatchStats,
                };
            })
        );
    }

    public updateStats(
        matchId: string,
        statsUpdate: MatchStatsUpdate
    ): Observable<MatchStatsUpdate> {
        const reqPath: string = `${this.baseUrl}/api/matches/${matchId}/stats`;

        return this.httpClient
            .patch<MatchStatsUpdate>(reqPath, statsUpdate, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    public updatePlayerGrid(
        matchId: string,
        playerId: string,
        gridUpdate: BattleshipGrid
    ): Observable<BattleshipGrid> {
        const reqPath: string = `${this.baseUrl}/api/matches/${matchId}/players/${playerId}/grid`;

        return this.httpClient
            .put<BattleshipGrid>(reqPath, gridUpdate, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    public fireShot(matchId: string, shot: Shot): Observable<GridCoordinates> {
        const reqPath: string = `${this.baseUrl}/api/matches/${matchId}/players/${shot.playerId}/shotsFired`;

        return this.httpClient
            .post<GridCoordinates>(reqPath, shot.coordinates, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    public setReadyState(matchId: string, playerId: string, isReady: boolean): Observable<boolean> {
        const reqPath: string = `${this.baseUrl}/api/matches/${matchId}/players/${playerId}/ready`;
        const reqBody: StateChangeBody = {
            ready: isReady,
        };

        return this.httpClient
            .put<StateChangeBody>(reqPath, reqBody, this.createRequestOptions())
            .pipe(
                catchError(this.handleError),
                map<StateChangeBody, boolean>((res: StateChangeBody) => {
                    return res.ready;
                })
            );
    }
}
