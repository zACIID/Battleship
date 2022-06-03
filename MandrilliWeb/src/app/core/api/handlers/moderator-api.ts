import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

import { BaseAuthenticatedApi } from './base/base-authenticated-api';
import { AccessTokenProvider } from '../access/access-token-provider';
import { User } from '../../model/user/user';
import { LoginInfo } from './auth-api';

/**
 * Class that handles communication with moderator-related endpoints
 */
@Injectable()
export class ModeratorApi extends BaseAuthenticatedApi {
    public constructor(httpClient: HttpClient, accessTokenProvider: AccessTokenProvider) {
        super(httpClient, accessTokenProvider);
    }

    public addModerator(moderatorId: string, newModInfo: LoginInfo): Observable<User> {
        const reqPath: string = `/api/moderators/${moderatorId}/additions`;

        return this.httpClient
            .post<User>(reqPath, newModInfo, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    public banUser(moderatorId: string, banId: string): Observable<void> {
        const reqPath: string = `/api/moderators/${moderatorId}/bans`;

        return this.httpClient
            .post<void>(reqPath, banId, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }
}
