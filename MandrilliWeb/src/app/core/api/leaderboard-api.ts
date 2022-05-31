import { BaseAuthenticatedApi } from './base-api';
import { LeaderboardEntry } from '../model/leaderboard/entry';
import {handleError, createOptions} from '../handler/ErrorsNdHeaders'
import { Observable, throwError, catchError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';

/**
 * Class that handles communication with leaderboard-related endpoints
 */
export class LeaderboardApi extends BaseAuthenticatedApi {

    private authToken: string;
    public constructor(baseUrl: string, authToken: string, private http: HttpClient) {
        super(baseUrl, authToken);
        this.authToken = authToken
    }

    public getLeaderboard(skip: number, limit: number): Observable<{leaderboard: LeaderboardEntry[], nextPage: string}> {
        const reqPath: string = `/api/leaderboard`;
        return this.http.get<{leaderboard: LeaderboardEntry[], nextPage: string}>(reqPath, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        )
    }
}
