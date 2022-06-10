import { Component, OnInit } from '@angular/core';
import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';
import { MatchJoinedEmitter } from 'src/app/core/events/emitters/match-joined';
import { MatchLeftEmitter } from 'src/app/core/events/emitters/match-left';
import { PlayerWonEmitter } from 'src/app/core/events/emitters/player-won';
import { Match } from 'src/app/core/model/match/match';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchApi } from 'src/app/core/api/handlers/match-api';
import { BattleshipGrid } from 'src/app/core/model/match/battleship-grid';
import { ShotFiredListener } from 'src/app/core/events/listeners/shot-fired';
import { ShotData } from 'src/app/core/model/events/shot-data';

@Component({
    selector: 'app-game-screen',
    templateUrl: './game-screen.component.html',
    styleUrls: ['./game-screen.component.css'],
})
export class GameScreenComponent implements OnInit {

    private match: Match = new Match()
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
        let obs = this.route.params.subscribe((params) => {
            this.match.matchId = params['id'];
        });
        obs.add(this.matchClient.getMatch(this.match.matchId).subscribe((data) => {
            this.match = data
        }))
        this.joinMatch()
        this.shotListener.listen(this.pollingOpponetHits)
    }


    public doMove(){
        //depends on how gwends wants to retrieve user command 
    }

    private leaveMatch() {
        if (this.match.matchId) this.fleeMatchEmitter.emit({ matchId: this.match.matchId });
        else throw new Error('MatchId not found');
    }

    private joinMatch() {
        if (this.match?.matchId) this.joinMatchEmitter.emit({ matchId: this.match.matchId });
        else throw new Error('MatchId not found');
    }

    private saucingObservers() {
        if (this.match !== undefined) {
            this.fleeWinnerEmitter.emit({
                winnerId: this.userIdProvider.getUserId(),
                matchId: this.match.matchId,
            });
        } else {
            throw new Error('Match has not been set');
        }
    }

    private pollingOpponetHits(data: ShotData) {
        this.match.player1.grid.shotsReceived.push({row: data.coordinates.row, col: data.coordinates.col})
    }
}
