import { BaseAuthenticatedApi } from './base-api';
import { User } from '../model/user/user';
import { LoginInfo } from './auth-api';
import {handleError, createOptions} from '../handler/ErrorsNdHeaders'
import { throwError, catchError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

/**
 * Class that handles communication with moderator-related endpoints
 */
export class ModeratorApi extends BaseAuthenticatedApi {
    
    private authToken: string;

    public constructor(baseUrl: string, authToken: string, private http: HttpClient) {
        super(baseUrl, authToken);
        this.authToken = authToken
    }

    public addModerator(moderatorId: string, newModInfo: LoginInfo): Observable<User> {
        const reqPath: string = `/api/moderators/${moderatorId}/additions`;
        return this.http.post<User>( reqPath, newModInfo, createOptions({}, this.authToken) ).pipe(
            catchError(handleError)
        )
    }

    public banUser(moderatorId: string, banId: string): Observable<void> {
        const reqPath: string = `/api/moderators/${moderatorId}/bans`;
        return this.http.post<void>( reqPath, banId, createOptions({}, this.authToken) ).pipe(
            catchError(handleError)
        )
    }
}
