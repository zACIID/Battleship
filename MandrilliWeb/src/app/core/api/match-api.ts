import { BaseAuthenticatedApi } from './base-api';
import { Match } from '../model/match/match';
import { BattleshipGrid } from '../model/match/battleship-grid';
import { GridCoordinates } from '../model/match/coordinates';
import { throwError, catchError, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';


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

    private create_options( params = {} ) {
        return  {
            headers: new HttpHeaders({
            authorization: 'Bearer ' + this.authToken,
            'cache-control': 'no-cache',
            'Content-Type':  'application/json',
          }),
          params: new HttpParams( {fromObject: params} )
        };
    
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error.status}, ` +
            'body was: ' + JSON.stringify(error.error));
        }
    
        return throwError('Something bad happened; please try again later.');
    }

    public getMatch(matchId: string): Observable<Match> {
        const reqPath: string = `/api/matches/${matchId}`;
        return this.http.get<Match>( reqPath,  this.create_options() ).pipe(
            catchError(this.handleError)
        )
    }

    // TODO rimuovere? perché create viene fatta dal server in entrambi i casi,
    //  sia che matchmaking trova partita, sia che user accetta richiesta
    public createMatch(matchInfo: MatchInfo): Observable<Match> {
        const reqPath: string = `/api/matches`;
        return this.http.post<Match>( reqPath, matchInfo,  this.create_options() ).pipe(
            catchError(this.handleError)
        );
    }

    public updateStats(matchId: string, statsUpdate: MatchStatsUpdate): Observable<Match> {
        const reqPath: string = `/api/matches/${matchId}`;
        return this.http.patch<Match>( reqPath, statsUpdate,  this.create_options() ).pipe(
            catchError(this.handleError)
        );
    }

    public updatePlayerGrid(matchId: string, playerId: string, gridUpdate: BattleshipGrid): Observable<Match> {
        const reqPath: string = `/api/matches/${matchId}/players/${playerId}`;
        return this.http.put<Match>( reqPath, gridUpdate,  this.create_options() ).pipe(
            catchError(this.handleError)
        );
    }

    public fireShot(matchId: string, shot: Shot): Observable<Match> {
        const reqPath: string = `/api/matches/${matchId}/players/${shot.playerId}/shotsFired`;
        return this.http.post<Match>( reqPath, shot,  this.create_options() ).pipe(
            catchError(this.handleError)
        );
    }

    public setReadyState(matchId: string, playerId: string, isReady: boolean): Observable<Match> {
        const reqPath: string = `/api/matches/${matchId}/players/${playerId}/ready`;
        return this.http.put<Match>( reqPath, isReady,  this.create_options() ).pipe(
            catchError(this.handleError)
        );
    }
}
