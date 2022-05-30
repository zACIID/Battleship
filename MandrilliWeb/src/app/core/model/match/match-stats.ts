export interface MatchStats {
    /**
     * Id of player that won the match
     */
    winner: string;

    /**
     * Time that the match started at
     */
    startTime: Date;

    /**
     * Time that the match ended at
     */
    endTime: Date;

    /**
     * Total shots fired during the match
     */
    totalShots: number;

    /**
     * Number of ships destroyed during the match
     */
    totalHits: number;
}
