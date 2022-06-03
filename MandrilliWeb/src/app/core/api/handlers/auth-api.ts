import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

import { BaseApi } from './base/base-api';
import { User } from '../../model/user/user';

export interface LoginInfo {
    /**
     * Username credential
     */
    username?: string;

    /**
     * Password credential
     */
    password?: string;
}

export interface Jwt {
    /**
     * Value of the Json Web Token, used to authenticate future requests
     */
    token: string;
}

/**
 * Class that handles communication with authentication-related endpoints
 */
@Injectable({
    providedIn: 'root',
})
export class AuthApi extends BaseApi {
    public constructor(httpClient: HttpClient) {
        super(httpClient);
    }

    public login(credentials: LoginInfo): Observable<Jwt> {
        const reqPath: string = `/api/auth/signin`;

        return this.httpClient.post<Jwt>(reqPath, credentials).pipe(
            catchError(this.handleError)
        );
    }

    public register(credentials: LoginInfo): Observable<User> {
        const reqPath: string = `/api/auth/signup`;

        return this.httpClient.post<User>(reqPath, credentials).pipe(
            catchError(this.handleError)
        );
    }
}
