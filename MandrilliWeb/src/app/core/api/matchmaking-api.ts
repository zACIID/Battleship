import { BaseAuthenticatedApi } from './base-api';
import { Observable, catchError } from 'rxjs';
import {handleError, createOptions} from '../handler/ErrorsNdHeaders'
import {HttpClient } from '@angular/common/http';
import { Types } from 'mongoose';
import { Injectable } from '@angular/core';
/**
 * Class that handles communication with matchmaking-related endpoints
 */

@Injectable()
export class MatchmakingApi extends BaseAuthenticatedApi {

    private authToken: string;
    public constructor(baseUrl: string, authToken: string, private http: HttpClient) {
        super(baseUrl, authToken);
        this.authToken = authToken
    }

    public enqueue(userId: string): Observable<{userId: string}> {
        const reqPath: string = `/api/matchmaking/queue`;
        return this.http.put<{userId: string}>(reqPath, userId, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        )    
    }

    public removeFromQueue(userId: string): Observable<void> {
        const reqPath: string = `/api/matchmaking/queue/${userId}`;
        return this.http.delete<void>(reqPath, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        )
    }
}


