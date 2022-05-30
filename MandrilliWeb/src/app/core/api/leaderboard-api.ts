import { BaseAuthenticatedApi } from './base-api';
import { LeaderboardEntry } from '../model/leaderboard/entry';

/**
 * Class that handles communication with leaderboard-related endpoints
 */
export class LeaderboardApi extends BaseAuthenticatedApi {
    public constructor(baseUrl: string, authToken: string) {
        super(baseUrl, authToken);
    }

    public getLeaderboard(skip: number, limit: number): LeaderboardEntry[] {
        const reqPath: string = `/api/leaderboard`;

        throw new Error("Not Implemented");
    }
}
