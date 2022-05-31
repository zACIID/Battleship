import { BaseAuthenticatedApi } from './base-api';
import { Notification } from '../model/user/notification';
import {handleError, createOptions} from '../handler/ErrorsNdHeaders'
import { Observable, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

/**
 * Class that handles communication with relationship-related endpoints
 */
export class NotificationApi extends BaseAuthenticatedApi {

    private authToken: string;
    public constructor(baseUrl: string, authToken: string, private http: HttpClient) {
        super(baseUrl, authToken);
        this.authToken = authToken
    }

    public getNotifications(userId: string): Observable<Notification[]> {
        const reqPath: string = `/api/users/${userId}/notifications`;
        return this.http.get<Notification[]>(reqPath, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        )    
    }

    public addNotification(userId: string, n: Notification): Observable<Notification> {
        const reqPath: string = `/api/users/${userId}/notifications`;
        return this.http.post<Notification>(reqPath, n, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        )
    }

    public removeNotification(userId: string, n: Notification): Observable<void> {
        const reqPath: string = `/api/users/${userId}/notifications`;
        return this.http.delete<void>(reqPath, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        )
    }
}
