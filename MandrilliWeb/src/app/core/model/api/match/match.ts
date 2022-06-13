import { PlayerState } from '../../match/player-state';
import { ApiMatchStats } from './stats';

export interface ApiMatch {
    /**
     * Id of the match
     */
    matchId: string;

    /**
     * State of player #1 of the match
     */
    player1: PlayerState;

    /**
     * State of player #2 of the match
     */
    player2: PlayerState;

    /**
     * Id of the player's chat
     */
    playersChat: string;

    /**
     * Id of the observers' chat
     */
    observersChat: string;

    /**
     * Statistics of the match
     */
    stats: ApiMatchStats;
}
