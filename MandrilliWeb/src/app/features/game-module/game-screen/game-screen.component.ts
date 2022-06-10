import { Component, OnInit } from '@angular/core';
import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';
import { MatchJoinedEmitter } from 'src/app/core/events/emitters/match-joined';
import { MatchLeftEmitter } from 'src/app/core/events/emitters/match-left';
import { PlayerWonEmitter } from 'src/app/core/events/emitters/player-won';
import { Match } from 'src/app/core/model/match/match';
import { ActivatedRoute } from '@angular/router';
import { MatchApi } from 'src/app/core/api/handlers/match-api';
import { BattleshipGrid } from 'src/app/core/model/match/battleship-grid';

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
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.match.matchId = params['id'];
        });
        this.matchClient.getMatch(this.match.matchId).subscribe((data) => {
            this.match = data
        })
        this.joinMatch()
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

    private pollingOpponets() {
        
    }
}
