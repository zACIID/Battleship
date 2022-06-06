import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

import { BaseAuthenticatedApi } from './base/base-authenticated-api';
import { JwtProvider } from '../jwt-auth/jwt-provider';
import { LeaderboardPage } from '../../model/api/leaderboard/page';

/**
 * Class that handles communication with leaderboard-related endpoints
 */
@Injectable({
    providedIn: 'root',
})
export class LeaderboardApi extends BaseAuthenticatedApi {
    public constructor(httpClient: HttpClient, accessTokenProvider: JwtProvider) {
        super(httpClient, accessTokenProvider);
    }

    public getLeaderboard(skip: number, limit: number): Observable<LeaderboardPage> {
        const queryParams: string = `skip=${skip}&limit=${limit}`;
        const reqPath: string = `${this.baseUrl}/api/leaderboard?${queryParams}`;

        return this.httpClient
            .get<LeaderboardPage>(reqPath, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }
}
