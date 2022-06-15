import { Notification } from '../../model/user/notification';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';

import { BaseAuthenticatedApi } from './base/base-authenticated-api';
import { JwtProvider } from '../jwt-auth/jwt-provider';

interface GetNotificationsResponse {
    notifications: Notification[];
}

/**
 * Class that handles communication with relationship-related endpoints
 */
@Injectable({
    providedIn: 'root',
})
export class NotificationApi extends BaseAuthenticatedApi {
    public constructor(httpClient: HttpClient, accessTokenProvider: JwtProvider) {
        super(httpClient, accessTokenProvider);
    }

    public getNotifications(userId: string): Observable<Notification[]> {
        const reqPath: string = `${this.baseUrl}/api/users/${userId}/notifications`;

        return this.httpClient
            .get<GetNotificationsResponse>(reqPath, this.createRequestOptions())
            .pipe(
                catchError(this.handleError),
                map<GetNotificationsResponse, Notification[]>((res: GetNotificationsResponse) => {
                    return res.notifications;
                })
            );
    }

    public addNotification(
        userId: string,
        newNotification: Notification
    ): Observable<Notification> {
        const reqPath: string = `${this.baseUrl}/api/users/${userId}/notifications`;

        return this.httpClient
            .post<Notification>(reqPath, newNotification, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    public removeNotification(userId: string, n: Notification): Observable<void> {
        const queryParams: string = `type=${n.type}&sender=${n.sender}`;
        const reqPath: string = `${this.baseUrl}/api/users/${userId}/notifications?${queryParams}`;

        return this.httpClient
            .delete<void>(reqPath, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }
}
