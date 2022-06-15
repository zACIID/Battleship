import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

import { BaseAuthenticatedApi } from './base/base-authenticated-api';
import { JwtProvider } from '../jwt-auth/jwt-provider';

export interface EnqueueResponse {
    userId: string;
}

/**
 * Class that handles communication with matchmaking-related endpoints
 */
@Injectable({
    providedIn: 'root',
})
export class MatchmakingApi extends BaseAuthenticatedApi {
    public constructor(httpClient: HttpClient, accessTokenProvider: JwtProvider) {
        super(httpClient, accessTokenProvider);
    }

    public enqueue(userId: string): Observable<EnqueueResponse> {
        const reqPath: string = `${this.baseUrl}/api/matchmaking/queue`;
        return this.httpClient
            .put<EnqueueResponse>(reqPath, userId, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    public removeFromQueue(userId: string): Observable<void> {
        const reqPath: string = `${this.baseUrl}/api/matchmaking/queue/${userId}`;
        return this.httpClient
            .delete<void>(reqPath, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }
}
