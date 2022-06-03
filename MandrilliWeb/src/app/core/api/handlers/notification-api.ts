import { Notification } from '../../model/user/notification';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

import { BaseAuthenticatedApi } from './base/base-authenticated-api';
import { AccessTokenProvider } from '../access/access-token-provider';

/**
 * Class that handles communication with relationship-related endpoints
 */
@Injectable({
    providedIn: "root"
})
export class NotificationApi extends BaseAuthenticatedApi {
    public constructor(httpClient: HttpClient, accessTokenProvider: AccessTokenProvider) {
        super(httpClient, accessTokenProvider);
    }

    public getNotifications(userId: string): Observable<Notification[]> {
        const reqPath: string = `/api/users/${userId}/notifications`;

        return this.httpClient.get<Notification[]>(reqPath, this.createRequestOptions()).pipe(
            catchError(this.handleError)
        )
    }

    public addNotification(userId: string, newNotification: Notification): Observable<Notification> {
        const reqPath: string = `/api/users/${userId}/notifications`;

        return this.httpClient.post<Notification>(reqPath, newNotification, this.createRequestOptions()).pipe(
            catchError(this.handleError)
        )
    }

    public removeNotification(userId: string, n: Notification): Observable<void> {
        const queryParams: string = `type=${n.type}&sender=${n.sender}`;
        const reqPath: string = `/api/users/${userId}/notifications?${queryParams}`;

        return this.httpClient.delete<void>(reqPath, this.createRequestOptions()).pipe(
            catchError(this.handleError)
        )
    }
}
