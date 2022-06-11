import { HtmlErrorMessage } from './../../../core/model/utils/htmlErrorMessage';
import { GridCoordinates } from './../../../../../../src/model/match/state/grid-coordinates';
import { BattleshipGrid } from './../../../core/model/match/battleship-grid';
import { Component, OnInit } from '@angular/core';
import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';
import { MatchJoinedEmitter } from 'src/app/core/events/emitters/match-joined';
import { MatchLeftEmitter } from 'src/app/core/events/emitters/match-left';
import { PlayerWonEmitter } from 'src/app/core/events/emitters/player-won';
import { Match } from 'src/app/core/model/match/match';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchApi } from 'src/app/core/api/handlers/match-api';
import { ShotFiredListener } from 'src/app/core/events/listeners/shot-fired';
import { ShotData } from 'src/app/core/model/events/shot-data';

@Component({
    selector: 'app-game-screen',
    templateUrl: './game-screen.component.html',
    styleUrls: ['./game-screen.component.css'],
})
export class GameScreenComponent implements OnInit {

    public userInSessionId: string = "";
    private match: Match = new Match();
    public playerGrid: BattleshipGrid = new BattleshipGrid();
    public opponentGrid: BattleshipGrid = new BattleshipGrid();
    public opponentsId: string = "";
    public chatId: string = "";
    private shipsCoordinates: GridCoordinates[] = [];
    public userMessage: HtmlErrorMessage = new HtmlErrorMessage();


    constructor(
        private route: ActivatedRoute,
        private joinMatchEmitter: MatchJoinedEmitter,
        private fleeMatchEmitter: MatchLeftEmitter,
        private fleeWinnerEmitter: PlayerWonEmitter,
        private userIdProvider: UserIdProvider,
        private matchClient: MatchApi,
        private router: Router, 
        private shotListener: ShotFiredListener
    ) {}

    ngOnInit(): void {

        try{
            this.userInSessionId = this.userIdProvider.getUserId()

            let obs = this.route.params.subscribe((params) => {
                this.match.matchId = params['id'];
            });

            obs.add(this.matchClient.getMatch(this.match.matchId).subscribe((data) => {
                this.match = data;

                if(data.player1.playerId === this.userInSessionId){
                    this.playerGrid = data.player1.grid;
                    this.opponentGrid = data.player2.grid;
                    this.opponentsId = data.player2.playerId;

                }
                else{
                    this.playerGrid = data.player2.grid;
                    this.opponentGrid = data.player1.grid;
                    this.opponentsId = data.player1.playerId;
                }
                this.chatId = data.playersChat;

            }))

            for(let ships of this.playerGrid.ships){
                for(let coord of ships.coordinates){
                    this.shipsCoordinates.push(coord);
                }
            }

            this.joinMatch();
            this.shotListener.listen(this.pollingOpponentHits);
        }
        catch(err){
            console.log("An error occurred while initializing the game screen: " + err);
        }
    }


    public shot(row: string, col: string){
        //TODO -> parse coords, check if valids and fire a shot on match api -> implements turn
    }

    public leaveMatch() {
        const path: string = "/match-results/" + this.match.matchId;
        if (this.match.matchId) this.fleeMatchEmitter.emit({ matchId: this.match.matchId });
        else throw new Error('MatchId not found');
        this.router.navigate([path]);
    }

    private joinMatch() {
        if (this.match?.matchId) this.joinMatchEmitter.emit({ matchId: this.match.matchId });
        else throw new Error('MatchId not found');
    }

    private lostAndSauced() {
        if (this.match !== undefined) {
            this.fleeWinnerEmitter.emit({
                winnerId: this.opponentsId,
                matchId: this.match.matchId,
            });

            this.fleeMatchEmitter.emit({
                matchId: this.match.matchId
            })
            
        } else {
            throw new Error('Match has not been set');
        }
    }

    private pollingOpponentHits(data: ShotData) {
        if(this.match.player1.playerId !== this.userInSessionId) {
            this.match.player1.grid.shotsReceived.push(data.coordinates);
        }
        else this.match.player2.grid.shotsReceived.push(data.coordinates);

        this.shipsCoordinates = this.shipsCoordinates.filter((e) => (e.row !== data.coordinates.row && e.col !== data.coordinates.col));

        if(this.shipsCoordinates.length === 0){
            this.lostAndSauced();
        }
    }

    private win() {}
}
