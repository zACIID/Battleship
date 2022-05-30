import { BaseAuthenticatedApi } from './base-api';

/**
 * Class that handles communication with matchmaking-related endpoints
 */
export class MatchmakingApi extends BaseAuthenticatedApi {
    public constructor(baseUrl: string, authToken: string) {
        super(baseUrl, authToken);
    }

    public enqueue(userId: string): boolean {
        const reqPath: string = `/api/matchmaking/queue`;

        throw new Error("Not Implemented");
    }

    public removeFromQueue(userId: string): boolean {
        const reqPath: string = `/api/matchmaking/queue`;

        throw new Error("Not Implemented");
    }
}
