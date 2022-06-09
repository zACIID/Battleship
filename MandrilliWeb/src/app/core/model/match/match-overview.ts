export interface MatchOverview {
    /**
     * Id of the match
     */
    matchId: string;

    /**
     * Id of player #1 of the match
     */
    player1Id: string;

    /**
     * Id of player #2 of the match
     */
    player2Id: string;

    /**
     * username of player #1 of the match
     */
    username1: string;

    /**
     * username of player #2 of the match
     */
    username2: string;

    /**
     * Id of the winner
     */
    winner: string;
}
