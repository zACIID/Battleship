import { BaseAuthenticatedApi } from './base-api';
import { User } from '../model/user/user';
import { UserStats } from '../model/user/user-stats';

/**
 * Class that handles communication with user-related endpoints
 */
export class UserApi extends BaseAuthenticatedApi {
    public constructor(baseUrl: string, authToken: string) {
        super(baseUrl, authToken);
    }

    public getUser(userId: string): User {
        const reqPath: string = `/api/users/${userId}`;

        throw new Error("Not Implemented");
    }

    public getMultipleUsers(userIds: string[]): User[] {
        const reqPath: string = `/api/users`;

        throw new Error("Not Implemented");
    }

    public deleteUser(userId: string): boolean {
        // TODO non serve perché unico che cancella user è moderator tramite il suo endpoint?
        //  oppure opzione che user si cancella dal sistema?
        const reqPath: string = `/api/users/${userId}`;

        throw new Error("Not Implemented");
    }

    public updatePassword(userId: string, newPassword: string): boolean {
        const reqPath: string = `/api/users/${userId}/password`;

        throw new Error("Not Implemented");
    }

    public updateUsername(userId: string, newUsername: string): boolean {
        const reqPath: string = `/api/users/${userId}/username`;

        throw new Error("Not Implemented");
    }

    public getStats(userId: string): UserStats {
        const reqPath: string = `/api/users/${userId}/stats`;

        throw new Error("Not Implemented");
    }

    public updateStats(userId: string, statsUpdate: UserStats): boolean {
        const reqPath: string = `/api/users/${userId}/stats`;

        throw new Error("Not Implemented");
    }
}
