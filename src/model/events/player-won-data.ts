/**
 * Data sent with the event fired when a player wins the game
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
