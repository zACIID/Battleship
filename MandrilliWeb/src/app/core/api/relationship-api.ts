import { BaseAuthenticatedApi } from './base-api';
import { Relationship } from '../model/user/relationship';

/**
 * Class that handles communication with relationship-related endpoints
 */
export class RelationshipApi extends BaseAuthenticatedApi {
    public constructor(baseUrl: string, authToken: string) {
        super(baseUrl, authToken);
    }

    public getRelationships(userId: string): Relationship[] {
        const reqPath: string = `/api/users/${userId}/relationships`;

        throw new Error("Not Implemented");
    }

    public addRelationship(userId: string, newRel: Relationship): boolean {
        const reqPath: string = `/api/users/${userId}/relationships`;

        throw new Error("Not Implemented");
    }

    public removeRelationship(userId: string, friendId: string): boolean {
        const reqPath: string = `/api/users/${userId}/relationships/${friendId}`;

        throw new Error("Not Implemented");
    }
}
