import { BaseAuthenticatedApi } from './base-api';
import { Match } from '../model/match/match';
import { BattleshipGrid } from '../model/match/battleship-grid';
import { GridCoordinates } from '../model/match/coordinates';
import { catchError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {handleError, createOptions} from '../handler/ErrorsNdHeaders'
import { Ship } from '../model/match/ship';

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

    private authToken: string;
    public constructor(private http: HttpClient, baseUrl: string, authToken: string) {
        super(baseUrl, authToken);
        this.authToken = authToken;
    }


    public getMatch(matchId: string): Observable<Match> {
        const reqPath: string = `/api/matches/${matchId}`;
        return this.http.get<Match>( reqPath, createOptions({}, this.authToken) ).pipe(
            catchError(handleError)
        )
    }

    // TODO rimuovere? perché create viene fatta dal server in entrambi i casi,
    //  sia che matchmaking trova partita, sia che user accetta richiesta
    public createMatch(matchInfo: MatchInfo): Observable<Match> {
        const reqPath: string = `/api/matches`;
        return this.http.post<Match>( reqPath, matchInfo, createOptions({}, this.authToken) ).pipe(
            catchError(handleError)
        );
    }

    public updateStats(matchId: string, statsUpdate: MatchStatsUpdate): Observable<MatchInfo> {
        const reqPath: string = `/api/matches/${matchId}`;
        return this.http.patch<MatchInfo>( reqPath, statsUpdate, createOptions({}, this.authToken) ).pipe(
            catchError(handleError)
        );
    }

    public updatePlayerGrid(matchId: string, playerId: string, gridUpdate: BattleshipGrid): Observable<Ship> {
        const reqPath: string = `/api/matches/${matchId}/players/${playerId}`;
        return this.http.put<Ship>( reqPath, gridUpdate, createOptions({}, this.authToken) ).pipe(
            catchError(handleError)
        );
    }

    public fireShot(matchId: string, shot: Shot): Observable<Shot> {
        const reqPath: string = `/api/matches/${matchId}/players/${shot.playerId}/shotsFired`;
        return this.http.post<Shot>( reqPath, shot, createOptions({}, this.authToken) ).pipe(
            catchError(handleError)
        );
    }

    public setReadyState(matchId: string, playerId: string, isReady: boolean): Observable<boolean> {
        const reqPath: string = `/api/matches/${matchId}/players/${playerId}/ready`;
        return this.http.put<boolean>( reqPath, isReady, createOptions({}, this.authToken) ).pipe(
            catchError(handleError)
        );
    }
}
