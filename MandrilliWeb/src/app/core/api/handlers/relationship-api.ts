import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Injectable } from '@angular/core';

import { Relationship } from '../../model/user/relationship';
import { BaseAuthenticatedApi } from './base/base-authenticated-api';
import { JwtProvider } from '../jwt-auth/jwt-provider';

/**
 * Class that handles communication with relationship-related endpoints
 */
@Injectable({
    providedIn: 'root',
})
export class RelationshipApi extends BaseAuthenticatedApi {
    public constructor(httpClient: HttpClient, accessTokenProvider: JwtProvider) {
        super(httpClient, accessTokenProvider);
    }

    public getRelationships(userId: string): Observable<Relationship[]> {
        const reqPath: string = `${this.baseUrl}/api/users/${userId}/relationships`;
        return this.httpClient
            .get<Relationship[]>(reqPath, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    public addRelationship(userId: string, newRel: Relationship): Observable<Relationship> {
        const reqPath: string = `${this.baseUrl}/api/users/${userId}/relationships`;

        return this.httpClient
            .post<Relationship>(reqPath, newRel, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    public removeRelationship(userId: string, friendId: string): Observable<void> {
        const reqPath: string = `${this.baseUrl}/api/users/${userId}/relationships/${friendId}`;

        return this.httpClient
            .delete<void>(reqPath, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }
}
