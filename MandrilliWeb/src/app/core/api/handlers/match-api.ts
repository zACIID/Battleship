import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

import { BaseAuthenticatedApi } from './base/base-authenticated-api';
import { AccessTokenProvider } from '../access/access-token-provider';
import { Ship } from '../../model/match/ship';
import { Match } from '../../model/match/match';
import { BattleshipGrid } from '../../model/match/battleship-grid';
import { MatchStatsUpdate } from '../../model/api/match/match-stats-update';
import { Shot } from '../../model/api/match/shot';

/**
 * Class that handles communication with match-related endpoints
 */
@Injectable({
    providedIn: 'root',
})
export class MatchApi extends BaseAuthenticatedApi {
    public constructor(httpClient: HttpClient, accessTokenProvider: AccessTokenProvider) {
        super(httpClient, accessTokenProvider);
    }

    public getMatch(matchId: string): Observable<Match> {
        const reqPath: string = `/api/matches/${matchId}`;

        return this.httpClient
            .get<Match>(reqPath, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    public getUserMatches(userId: string): Observable<Match[]> {
        const reqPath: string = `/api/matches/${userId}`;

        return this.httpClient
            .get<Match[]>(reqPath, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    public updateStats(matchId: string, statsUpdate: MatchStatsUpdate): Observable<MatchStatsUpdate> {
        const reqPath: string = `/api/matches/${matchId}`;

        return this.httpClient
            .patch<MatchStatsUpdate>(reqPath, statsUpdate, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    public updatePlayerGrid(
        matchId: string,
        playerId: string,
        gridUpdate: BattleshipGrid
    ): Observable<Ship> {
        const reqPath: string = `/api/matches/${matchId}/players/${playerId}`;

        return this.httpClient
            .put<Ship>(reqPath, gridUpdate, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    public fireShot(matchId: string, shot: Shot): Observable<Shot> {
        const reqPath: string = `/api/matches/${matchId}/players/${shot.playerId}/shotsFired`;

        return this.httpClient
            .post<Shot>(reqPath, shot, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    public setReadyState(
        matchId: string,
        playerId: string,
        isReady: boolean
    ): Observable<{ ready: boolean }> {
        const reqPath: string = `/api/matches/${matchId}/players/${playerId}/ready`;

        return this.httpClient
            .put<{ ready: boolean }>(reqPath, isReady, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }
}
