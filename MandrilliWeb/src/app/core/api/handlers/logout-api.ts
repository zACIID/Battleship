import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { JwtProvider } from '../jwt-auth/jwt-provider';
import { BaseAuthenticatedApi } from './base/base-authenticated-api';

/**
 * Class that handles the logout procedure with the server api
 */
@Injectable({
    providedIn: 'root',
})
export class LogoutApi extends BaseAuthenticatedApi {
    public constructor(httpClient: HttpClient, accessTokenProvider: JwtProvider) {
        super(httpClient, accessTokenProvider);
    }

    public logout(): Observable<void> {
        const reqPath: string = `${this.baseUrl}/api/auth/signout`;

        return this.httpClient
            .post<void>(reqPath, {}, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }
}
