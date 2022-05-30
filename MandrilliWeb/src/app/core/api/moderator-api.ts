import { BaseAuthenticatedApi } from './base-api';
import { User } from '../model/user/user';
import { LoginInfo } from './auth-api';

/**
 * Class that handles communication with moderator-related endpoints
 */
export class ModeratorApi extends BaseAuthenticatedApi {
    public constructor(baseUrl: string, authToken: string) {
        super(baseUrl, authToken);
    }

    public addModerator(moderatorId: string, newModInfo: LoginInfo): User {
        const reqPath: string = `/api/moderators/${moderatorId}/additions`;

        throw new Error("Not Implemented");
    }

    public banUser(moderatorId: string, banId: string): User {
        const reqPath: string = `/api/moderators/${moderatorId}/bans`;

        throw new Error("Not Implemented");
    }
}
