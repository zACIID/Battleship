export interface MatchInfo {
    /**
     * Id of player #1 of the match
     */
    player1Id: string;

    /**
     * Id of player #2 of the match
     */
    player2Id: string;
}

export interface ApiMatchStats {
    /**
     * Id of player that won the match
     */
    winner: string;

    /**
     * Time (in unix seconds) that the match started at
     */
    startTime: number;

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
