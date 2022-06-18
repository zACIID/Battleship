import { MatchData } from './match-data';

/**
 * Enumeration that defines the reasons that a user could join a match for.
 */
export enum JoinReason {
    Player = 'Player',
    Spectator = 'Spectator',
}

/**
 * Data received on a match join event
 */
export interface MatchJoinedData extends MatchData {
    userId: string;
    joinReason: JoinReason;
}
