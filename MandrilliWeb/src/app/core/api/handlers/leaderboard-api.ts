import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

import { BaseAuthenticatedApi } from './base/base-authenticated-api';
import { LeaderboardEntry } from '../../model/leaderboard/entry';
import { AccessTokenProvider } from '../access-token-provider';

export interface LeaderboardPage {
    leaderboard: LeaderboardEntry[];
    nextPage: string;
}

/**
 * Class that handles communication with leaderboard-related endpoints
 */
@Injectable({
    providedIn: "root"
})
export class LeaderboardApi extends BaseAuthenticatedApi {
    public constructor(httpClient: HttpClient, accessTokenProvider: AccessTokenProvider) {
        super(httpClient, accessTokenProvider);
    }

    public getLeaderboard(skip: number, limit: number): Observable<LeaderboardPage> {
        const queryParams: string = `skip=${skip}&limit=${limit}`;
        const reqPath: string = `/api/leaderboard?${queryParams}`;

        return this.httpClient.get<LeaderboardPage>(reqPath, this.createRequestOptions()).pipe(
            catchError(this.handleError)
        )
    }
}
