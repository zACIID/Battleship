import { MatchData } from './match-data';

/**
 * Interface that models the data received on a match left event
 */
export interface MatchLeftData extends MatchData {
    /**
     * Id of the user that is leaving the match
     */
    userId: string;
}
