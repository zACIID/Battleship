import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

import { BaseAuthenticatedApi } from './base/base-authenticated-api';
import { JwtProvider } from '../jwt-auth/jwt-provider';
import { User } from '../../model/user/user';
import { LoginInfo } from './auth-api';

/**
 * Class that handles communication with moderator-related endpoints.
 * Such endpoints can be used only by a user with the Moderator role.
 */
@Injectable({
    providedIn: 'root',
})
export class ModeratorApi extends BaseAuthenticatedApi {
    public constructor(httpClient: HttpClient, accessTokenProvider: JwtProvider) {
        super(httpClient, accessTokenProvider);
    }

    /**
     * Adds a new moderator with the provided credentials.
     * Such credentials are temporary and will be updated by the new moderator
     * in occasion of its first login.
     * @param credentials
     */
    public addModerator(credentials: LoginInfo): Observable<User> {
        const reqPath: string = `${this.baseUrl}/api/moderators/additions`;

        return this.httpClient
            .post<User>(reqPath, credentials, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    /**
     * Bans the user with the specified username
     * @param username
     */
    public banUser(username: string): Observable<void> {
        const reqPath: string = `${this.baseUrl}/api/moderators/bans`;

        return this.httpClient
            .post<void>(reqPath, { username: username }, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    /**
     * Updates the credentials of a moderator after he performs its first login.
     * @param newCredentials
     */
    public updateTemporaryCredentials(newCredentials: LoginInfo): Observable<void> {
        const reqPath: string = `${this.baseUrl}/api/moderators/credentials`;

        return this.httpClient
            .put<void>(reqPath, newCredentials, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }
}
