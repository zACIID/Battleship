import { BaseAuthenticatedApi } from './base-api';
import { Relationship } from '../model/user/relationship';
import { HttpClient } from '@angular/common/http';
import {handleError, createOptions} from '../handler/ErrorsNdHeaders'
import { Observable, catchError } from 'rxjs';

/**
 * Class that handles communication with relationship-related endpoints
 */
export class RelationshipApi extends BaseAuthenticatedApi {

    private authToken: string;
    public constructor(baseUrl: string, authToken: string, private http: HttpClient) {
        super(baseUrl, authToken);
        this.authToken = authToken
    }

    public getRelationships(userId: string): Observable<Relationship[]> {
        const reqPath: string = `/api/users/${userId}/relationships`;
        return this.http.get<Relationship[]>(reqPath, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        )
    }

    public addRelationship(userId: string, newRel: Relationship): Observable<Relationship> {
        const reqPath: string = `/api/users/${userId}/relationships`;
        return this.http.post<Relationship>(reqPath, newRel, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        )
    }

    public removeRelationship(userId: string, friendId: string): Observable<void> {
        const reqPath: string = `/api/users/${userId}/relationships/${friendId}`;
        return this.http.delete<void>(reqPath, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        )
    }
}
