export interface ApiMatchStats {
    /**
     * Id of player that won the match
     */
    winner: string;

    /**
     * Time that the match started at
     */
    startTime: string;

    /**
     * Time that the match ended at
     */
    endTime: string;

    /**
     * Total shots fired during the match
     */
    totalShots: number;

    /**
     * Number of ships destroyed during the match
     */
    shipsDestroyed: number;
}
