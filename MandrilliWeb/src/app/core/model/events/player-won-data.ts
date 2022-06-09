/**
 * Data sent on the event fired when a player wins the match
 */
export interface PlayerWonData {
    /**
     * Id of the player that won
     */
    winnerId: string;

    /**
     * Id of the match that the player won
     */
    matchId: string;
}
