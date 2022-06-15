import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';

import { BaseAuthenticatedApi } from './base/base-authenticated-api';
import { JwtProvider } from '../jwt-auth/jwt-provider';
import { User } from '../../model/user/user';
import { ApiUserStats } from '../../model/api/user/stats';
import { UserStats } from '../../model/user/stats';
import { getRank } from '../../model/user/elo-rankings';
import { Match } from '../../model/match/match';

/**
 * Interface that represents an Update Username endpoint response
 */
export interface UsernameUpdate {
    username: string;
}

interface PasswordUpdate {
    password: string;
}

interface GetMultipleUsersResponse {
    users: User[];
}

/**
 * Interface that represents a response from the currentMatch endpoint
 */
interface CurrentMatchResponse {
    matchId: string;
}

/**
 * Class that handles communication with user-related endpoints
 */
@Injectable({
    providedIn: 'root',
})
export class UserApi extends BaseAuthenticatedApi {
    public constructor(httpClient: HttpClient, accessTokenProvider: JwtProvider) {
        super(httpClient, accessTokenProvider);
    }

    public getUser(userId: string): Observable<User> {
        const reqPath: string = `${this.baseUrl}/api/users/${userId}`;
        return this.httpClient
            .get<User>(reqPath, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    public getCurrentMatch(userId: string): Observable<string> {
        const reqPath: string = `${this.baseUrl}/api/users/${userId}/currentMatch`;

        return this.httpClient.get<CurrentMatchResponse>(reqPath, this.createRequestOptions()).pipe(
            catchError(this.handleError),
            map<CurrentMatchResponse, string>((res: CurrentMatchResponse) => {
                return res.matchId;
            })
        );
    }

    public getMultipleUsers(userIds: string[]): Observable<User[]> {
        const queryParams: string = `ids=${userIds.join(',')}`;
        const reqPath: string = `${this.baseUrl}/api/users?${queryParams}`;

        return this.httpClient
            .get<GetMultipleUsersResponse>(reqPath, this.createRequestOptions())
            .pipe(
                catchError(this.handleError),
                map<GetMultipleUsersResponse, User[]>((res: GetMultipleUsersResponse) => {
                    return res.users;
                })
            );
    }

    public deleteUser(userId: string): Observable<void> {
        const reqPath: string = `${this.baseUrl}/api/users/${userId}`;

        return this.httpClient
            .delete<void>(reqPath, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    public updatePassword(userId: string, newPassword: string): Observable<void> {
        const reqPath: string = `${this.baseUrl}/api/users/${userId}/password`;
        const reqBody: PasswordUpdate = {
            password: newPassword,
        };

        return this.httpClient
            .put<void>(reqPath, reqBody, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    public updateUsername(userId: string, newUsername: string): Observable<UsernameUpdate> {
        const reqPath: string = `${this.baseUrl}/api/users/${userId}/username`;
        const reqBody: UsernameUpdate = {
            username: newUsername,
        };

        return this.httpClient
            .put<UsernameUpdate>(reqPath, reqBody, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    public getStats(userId: string): Observable<UserStats> {
        const reqPath: string = `${this.baseUrl}/api/users/${userId}/stats`;

        return this.httpClient.get<ApiUserStats>(reqPath, this.createRequestOptions()).pipe(
            catchError(this.handleError),
            map<ApiUserStats, UserStats>((apiStats: ApiUserStats) => {
                return {
                    ...apiStats,
                    rank: getRank(apiStats.elo),
                };
            })
        );
    }

    public getUserMatches(userId: string): Observable<Match[]> {
        const reqPath: string = `${this.baseUrl}/users/${userId}/matches`;

        return this.httpClient
            .get<Match[]>(reqPath, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    public updateStats(userId: string, statsUpdate: ApiUserStats): Observable<ApiUserStats> {
        const reqPath: string = `${this.baseUrl}/api/users/${userId}/stats`;

        return this.httpClient
            .put<ApiUserStats>(reqPath, statsUpdate, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }
}
