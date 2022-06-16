import { MatchStatsSubDocument } from '../../model/match/match-stats';

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
        winner: stats.winner.toString(),
        startTime: Math.floor(new Date(stats.startTime).getTime() / 1000),
        endTime: Math.floor(new Date(stats.endTime).getTime() / 1000),
        totalShots: stats.totalShots,
        shipsDestroyed: stats.shipsDestroyed,
    };
};
