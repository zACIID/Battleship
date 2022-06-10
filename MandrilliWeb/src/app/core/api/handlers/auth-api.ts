import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

import { BaseApi } from './base/base-api';
import { User } from '../../model/user/user';

export interface LoginInfo {
    /**
     * Username credential
     */
    username: string;

    /**
     * Password credential
     */
    password: string;
}

export interface AuthResult {
    /**
     * Id of the user that authenticated
     */
    userId: string;

    /**
     * Value of the Json Web Token, used to authenticate future requests
     */
    jwt: string;
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

    // TODO change and make it return a Promise<void>
    //  here the jwt should be awaited and then set inside the (injected) JwtStorage
    //  any update here should be reflected in the login component
    public login(credentials: LoginInfo): Observable<AuthResult> {
        const reqPath: string = `${this.baseUrl}/api/auth/signin`;

        return this.httpClient
            .post<AuthResult>(reqPath, credentials)
            .pipe(catchError(this.handleError));
    }

    public register(credentials: LoginInfo): Observable<User> {
        const reqPath: string = `${this.baseUrl}/api/auth/signup`;

        return this.httpClient.post<User>(reqPath, credentials).pipe(catchError(this.handleError));
    }
}
