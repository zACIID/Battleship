import { BaseAuthenticatedApi } from './base-api';
import { Match } from '../model/match/match';
import { BattleshipGrid } from '../model/match/battleship-grid';
import { GridCoordinates } from '../model/match/coordinates';

export interface MatchInfo {
    /**
     * Id of player #1 of the match
     */
    player1Id: string;

    /**
     * Id of player #2 of the match
     */
    player2Id: string;
}

export interface MatchStatsUpdate {
    /**
     * Id of player that won the match
     */
    winner: string;

    /**
     * Time (in unix seconds) that the match ended at
     */
    endTime: number;

    /**
     * Total shots fired during the match
     */
    totalShots: number;

    /**
     * Number of ships destroyed during the match
     */
    totalHits: number;
}

export interface Shot {
    playerId: string;
    coordinates: GridCoordinates;
}

/**
 * Class that handles communication with match-related endpoints
 */
export class MatchApi extends BaseAuthenticatedApi {
    public constructor(baseUrl: string, authToken: string) {
        super(baseUrl, authToken);
    }

    public getMatch(matchId: string): Match {
        const reqPath: string = `/api/matches/${matchId}`;

        throw new Error("Not Implemented");
    }

    // TODO rimuovere? perché create viene fatta dal server in entrambi i casi,
    //  sia che matchmaking trova partita, sia che user accetta richiesta
    public createMatch(matchInfo: MatchInfo): boolean {
        const reqPath: string = `/api/matches`;

        throw new Error("Not Implemented");
    }

    public updateStats(matchId: string, statsUpdate: MatchStatsUpdate): boolean {
        const reqPath: string = `/api/matches/${matchId}`;

        throw new Error("Not Implemented");
    }

    public updatePlayerGrid(matchId: string, playerId: string, gridUpdate: BattleshipGrid): boolean {
        const reqPath: string = `/api/matches/${matchId}/players/${playerId}`;

        throw new Error("Not Implemented");
    }

    public fireShot(matchId: string, shot: Shot): boolean {
        const reqPath: string = `/api/matches/${matchId}/players/${shot.playerId}/shotsFired`;

        throw new Error("Not Implemented");
    }

    public setReadyState(matchId: string, playerId: string, isReady: boolean): boolean {
        const reqPath: string = `/api/matches/${matchId}/players/${playerId}/ready`;

        throw new Error("Not Implemented");
    }
}
