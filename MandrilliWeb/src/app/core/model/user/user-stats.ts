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

export class CUserStats implements UserStats {
    elo: number;
    topElo: number;
    wins: number;
    losses: number;
    shipsDestroyed: number;
    totalShots: number;
    totalHits: number;
    rank?: string;
    constructor(elo: number = 0, topElo: number = 0, wins: number = 0, losses: number = 0, shipsDestroyed: number = 0, totalShots: number = 0, totalHits: number = 0){
        this.elo = elo
        this.topElo = topElo
        this.wins = wins
        this.losses = losses
        this.shipsDestroyed = shipsDestroyed
        this.totalShots = totalShots
        this.totalHits = totalHits
        this.rank = ""
    }
}