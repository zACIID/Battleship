export interface UserStats {
    /**
     * Current elo of the user
     */
    elo: number;

    /**
     * Highest elo reached by the user
     */
    topElo: number;

    /**
     * Total number of victories of the user
     */
    wins: number;

    /**
     * Total number of losses of the user
     */
    losses: number;

    /**
     * Total number of ships destroyed by the user
     */
    shipsDestroyed: number;

    /**
     * Total number of shots of the user
     */
    totalShots: number;

    /**
     * Total number of hits by the user
     */
    totalHits: number;
}
