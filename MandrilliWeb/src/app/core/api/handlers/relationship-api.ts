import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { Injectable } from '@angular/core';

import { Relationship, RelationshipsResponse } from '../../model/user/relationship';
import { BaseAuthenticatedApi } from './base/base-authenticated-api';
import { JwtProvider } from '../jwt-auth/jwt-provider';

interface AddRelationshipReqBody {
    friendId: string;
}

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
            .get<RelationshipsResponse>(reqPath, this.createRequestOptions())
            .pipe(
                catchError(this.handleError),
                map<RelationshipsResponse, Relationship[]>(
                    (el: RelationshipsResponse) => el.relationships
                )
            );
    }

    /**
     * Adds a relationship that involves the two specified users.
     * The addition is symmetrical, which means that the relationship is added to both users,
     * not just to one.
     *
     * @param userId id of the first friend
     * @param friendId id of the second friend
     */
    public addRelationship(userId: string, friendId: string): Observable<Relationship> {
        const reqPath: string = `${this.baseUrl}/api/users/${userId}/relationships`;
        const reqBody: AddRelationshipReqBody = {
            friendId: friendId,
        };

        return this.httpClient
            .post<Relationship>(reqPath, reqBody, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    /**
     * Removes a relationship that involves the two specified users.
     * The deletion is symmetrical, which means that the relationship is deleted for both users,
     * not just for one.
     *
     * @param userId id of the first friend
     * @param friendId id of the second friend
     */
    public removeRelationship(userId: string, friendId: string): Observable<void> {
        const reqPath: string = `${this.baseUrl}/api/users/${userId}/relationships/${friendId}`;

        return this.httpClient
            .delete<void>(reqPath, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }
}
