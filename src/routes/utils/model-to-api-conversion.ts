import { MatchStatsSubDocument } from '../../model/database/match/match-stats';
import { toUnixSeconds } from './date-utils';

/**
 * Interface that models the match stats object returned by
 * an api response
 */
export interface ApiMatchStats {
    winner: string;
    startTime: number;
    endTime: number;
    totalShots: number;
    shipsDestroyed: number;
}

/**
 * Converts the match stats sub-doc into an object suitable for an api response
 * @param stats
 */
export const toApiMatchStats = (stats: MatchStatsSubDocument): ApiMatchStats => {
    return {
        // Note: winner and endTime could be null if the match hasn't ended yet
        winner: stats.winner !== null ? stats.winner.toString() : null,
        startTime: toUnixSeconds(stats.startTime),
        endTime: stats.endTime !== null ? toUnixSeconds(stats.endTime) : null,
        totalShots: stats.totalShots,
        shipsDestroyed: stats.shipsDestroyed,
    };
};
