import { LeaderboardEntry } from '../../leaderboard/entry';

/**
 * Interface that represents a page of leaderboard results that
 * is sent by the server api
 */
export interface LeaderboardPage {
    leaderboard: LeaderboardEntry[];
    nextPage: string;
}
