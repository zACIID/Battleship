import { BaseAuthenticatedApi } from './base-api';
import { Observable, throwError, catchError } from 'rxjs';
import {handleError, createOptions} from '../handler/ErrorsNdHeaders'
import {HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
/**
 * Class that handles communication with matchmaking-related endpoints
 */
export class MatchmakingApi extends BaseAuthenticatedApi {

    private authToken: string;
    public constructor(baseUrl: string, authToken: string, private http: HttpClient) {
        super(baseUrl, authToken);
        this.authToken = authToken
    }

    public enqueue(userId: string): Observable<string> {
        const reqPath: string = `/api/matchmaking/queue`;
        return this.http.put<string>(reqPath, newPassword, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        )    
    }

    public removeFromQueue(userId: string): boolean {
        const reqPath: string = `/api/matchmaking/queue`;

        throw new Error("Not Implemented");
    }
}
