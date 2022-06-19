export class MatchStats {
    /**
     * Id of player that won the match
     * Can be null if match hasn't ended
     */
    winner: string | null = '';

    /**
     * Time that the match started at
     */
    startTime: Date = new Date();

    /**
     * Time that the match ended at
     * Can be null if match hasn't ended
     */
    endTime: Date | null = new Date();

    /**
     * Total shots fired during the match
     */
    totalShots: number = 0;

    /**
     * Number of ships destroyed during the match
     */
    shipsDestroyed: number = 0;

    constructor() {}
}
