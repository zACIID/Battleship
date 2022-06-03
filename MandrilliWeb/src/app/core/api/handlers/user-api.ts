import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

import { BaseAuthenticatedApi } from './base/base-authenticated-api';
import { AccessTokenProvider } from '../access/access-token-provider';
import { User } from '../../model/user/user';
import { UserStats } from '../../model/user/user-stats';

/**
 * Interface that represents an Update Username endpoint response
 */
export interface UsernameUpdate {
    username: string;
}

/**
 * Class that handles communication with user-related endpoints
 */
@Injectable({
    providedIn: "root"
})
export class UserApi extends BaseAuthenticatedApi {
    public constructor(httpClient: HttpClient, accessTokenProvider: AccessTokenProvider) {
        super(httpClient, accessTokenProvider);
    }

    public getUser(userId: string): Observable<User> {
        const reqPath: string = `/api/users/${userId}`;
        return this.httpClient.get<User>(reqPath, this.createRequestOptions()).pipe(
            catchError(this.handleError)
        )
    }

    public getMultipleUsers(userIds: string[]): Observable<User[]> {
        const reqPath: string = `/api/users`;
        const reqBody = {
            userIds: userIds
        }

        return this.httpClient.post<User[]>(reqPath, reqBody, this.createRequestOptions()).pipe(
            catchError(this.handleError)
        )
    }

    public deleteUser(userId: string): Observable<void> {
        const reqPath: string = `/api/users/${userId}`;

        return this.httpClient.delete<void>(reqPath, this.createRequestOptions()).pipe(
            catchError(this.handleError)
        )
    }

    public updatePassword(userId: string, newPassword: string): Observable<void> {
        const reqPath: string = `/api/users/${userId}/password`;
        return this.httpClient.put<void>(reqPath, newPassword, this.createRequestOptions()).pipe(
            catchError(this.handleError)
        )
    }

    public updateUsername(userId: string, newUsername: string): Observable<UsernameUpdate> {
        const reqPath: string = `/api/users/${userId}/username`;

        return this.httpClient.put<UsernameUpdate>(reqPath, newUsername, this.createRequestOptions()).pipe(
            catchError(this.handleError)
        )
    }

    public getStats(userId: string): Observable<UserStats> {
        const reqPath: string = `/api/users/${userId}/stats`;

        return this.httpClient.get<UserStats>(reqPath, this.createRequestOptions()).pipe(
            catchError(this.handleError)
        )
    }

    public updateStats(userId: string, statsUpdate: UserStats): Observable<UserStats> {
        const reqPath: string = `/api/users/${userId}/stats`;

        return this.httpClient.put<UserStats>(reqPath, statsUpdate, this.createRequestOptions()).pipe(
            catchError(this.handleError)
        )
    }
}
