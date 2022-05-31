import { BaseApi } from './base-api';
import { User } from '../model/user/user';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { UserStats } from '../model/user/user-stats';
import { Observable, throwError, catchError } from 'rxjs';
import {handleError, createOptions} from '../handler/ErrorsNdHeaders'

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

interface Jwt {
    /**
     * Value of the Json Web Token, used to authenticate future requests
     */
    token: string;
}

/**
 * Class that handles communication with authentication-related endpoints
 */
export class AuthApi extends BaseApi {
    public constructor(baseUrl: string, private http: HttpClient) {
        super(baseUrl);
    }

    // TODO login ritorna solo JWT, però a me serve anche userId per
    //  fare una getUser(userId). Considerare che Login debba ritornare anche uno userId
    public login(credentials: LoginInfo): Observable<{token: Jwt}> {
        const reqPath: string = `/api/auth/signin`;
        return this.http.post<{token: Jwt}>(reqPath, credentials).pipe(
            catchError(handleError)
        )
    }

    public register(credentials: LoginInfo): Observable<User> {
        const reqPath: string = `/api/auth/signup`;
        return this.http.post<User>(reqPath, credentials).pipe(
            catchError(handleError)
        )
    }
}
