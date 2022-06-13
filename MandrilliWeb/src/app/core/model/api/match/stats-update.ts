export interface StatsUpdate {
    /**
     * Id of player that won the match
     */
    winner: string;

    /**
     * Time (in unix seconds) that the match ended at
     */
    endTime: number;

    /**
     * Total shots fired during the match
     */
    totalShots: number;

    /**
     * Number of ships destroyed during the match
     */
    totalHits: number;
}
