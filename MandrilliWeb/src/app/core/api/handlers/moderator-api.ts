import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs'; // TODO non viene riconosciuto dal compiler se si esegue comando 'tsc'

import { BaseAuthenticatedApi } from './base/base-authenticated-api';
import { JwtProvider } from '../jwt-auth/jwt-provider';
import { User } from '../../model/user/user';
import { LoginInfo } from './auth-api';

/**
 * Class that handles communication with moderator-related endpoints
 */
@Injectable()
export class ModeratorApi extends BaseAuthenticatedApi {
    public constructor(httpClient: HttpClient, accessTokenProvider: JwtProvider) {
        super(httpClient, accessTokenProvider);
    }

    public addModerator(newModInfo: LoginInfo): Observable<User> {
        const reqPath: string = `${this.baseUrl}/api/moderators/additions`;
        // TODO add moderator with newModInfo.status.temporary = true 
        return this.httpClient
            .post<User>(reqPath, newModInfo, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    public banUser(username: string): Observable<void> {
        const reqPath: string = `${this.baseUrl}/api/moderators/bans`;

        return this.httpClient
            .post<void>(reqPath, {username: username}, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }
}
