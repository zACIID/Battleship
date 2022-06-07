export class MatchStats {
    /**
     * Id of player that won the match
     */
    winner: string = "";

    /**
     * Time that the match started at
     */
    startTime: Date = new Date();

    /**
     * Time that the match ended at
     */
    endTime: Date = new Date();

    /**
     * Total shots fired during the match
     */
    totalShots: number = 0;

    /**
     * Number of ships destroyed during the match
     */
    totalHits: number = 0;


    constructor(){
    }
}
