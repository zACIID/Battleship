import { BaseAuthenticatedApi } from './base-api';
import { User } from '../model/user/user';
import { HttpClient } from '@angular/common/http';
import { UserStats } from '../model/user/user-stats';
import { Observable, catchError } from 'rxjs';
import {handleError, createOptions} from '../handler/ErrorsNdHeaders'


/**
 * Class that handles communication with user-related endpoints
 */
export class UserApi extends BaseAuthenticatedApi {

    private authToken: string;
    
    public constructor(baseUrl: string, authToken: string, private http: HttpClient) {
        super(baseUrl, authToken);
        this.http = http;
        this.authToken = authToken;
    }

    public getUser(userId: string): Observable<User> {
        const reqPath: string = `/api/users/${userId}`;
        return this.http.get<User>(reqPath, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        )
    }

    public getMultipleUsers(userIds: string[]): Observable<User[]> {
        const reqPath: string = `/api/users`;
        return this.http.get<User[]>(reqPath, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        )
    }

    public deleteUser(userId: string): Observable<void> {
        const reqPath: string = `/api/users/${userId}`;
        return this.http.delete<void>(reqPath, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        )
    }

    public updatePassword(userId: string, newPassword: string): Observable<void> {
        const reqPath: string = `/api/users/${userId}/password`;
        return this.http.put<void>(reqPath, newPassword, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        )
    }

    public updateUsername(userId: string, newUsername: string): Observable<string> {
        const reqPath: string = `/api/users/${userId}/username`;
        return this.http.put<string>(reqPath, newUsername, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        )
    }

    public getStats(userId: string): Observable<UserStats> {
        const reqPath: string = `/api/users/${userId}/stats`;
        return this.http.get<UserStats>(reqPath, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        )
    }

    public updateStats(userId: string, statsUpdate: UserStats): Observable<UserStats> {
        const reqPath: string = `/api/users/${userId}/stats`;
        return this.http.put<UserStats>(reqPath, statsUpdate, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        )
    }
}
