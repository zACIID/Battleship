/**
 * Enumeration that defines all the possible reasons why a match could terminate
 */
export enum MatchTerminatedReason {
    PlayerLeftTheGame = 'A player has left the game',
    PlayerWon = 'Player has won the game',
}

/**
 * Data sent on a match termination event.
 * Contains the reason of why the match was terminated.
 */
export interface MatchTerminatedData {
    reason: MatchTerminatedReason;
}
