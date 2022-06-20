/**
 * Interface that models the data required to perform an update
 * of the stats of a match
 */
export interface MatchStatsUpdate {
    /**
     * Id of the winner of the match
     */
    winner: string;

    /**
     * Ending time of the game in unix seconds
     */
    endTime: number;

    /**
     * Total shots fired during the game
     */
    totalShots: number;

    /**
     * Total ships destroyed during the game
     */
    shipsDestroyed: number;
}
