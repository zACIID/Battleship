import { Match } from './../../../core/model/match/match';
import { MatchApi } from './../../../core/api/handlers/match-api';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';
import { MatchJoinedEmitter } from 'src/app/core/events/emitters/match-joined';
import { MatchLeftEmitter } from 'src/app/core/events/emitters/match-left';
import { PlayerWonEmitter } from 'src/app/core/events/emitters/player-won';

@Component({
    selector: 'match-result-screen',
    templateUrl: './match-result-screen.component.html',
    styleUrls: ['./match-result-screen.component.css'],
})
export class MatchResultScreenComponent implements OnInit {
    public matchShowedId: string = '';
    public match?: Match;
    public result: string = '';

    constructor(
        private route: ActivatedRoute,
        private matchClient: MatchApi,
        private userIdProvider: UserIdProvider,
        private joinMatchEmitter: MatchJoinedEmitter,
        private fleeMatchEmitter: MatchLeftEmitter,
        private fleeWinnerEmitter: PlayerWonEmitter
    ) {}

    ngOnInit(): void {
        try {
            let userId = this.userIdProvider.getUserId();

            this.route.params.subscribe((params) => {
                this.matchShowedId = params['id'];
            });

            this.matchClient.getMatch(this.matchShowedId).subscribe((data: Match) => {
                this.joinMatch();
                this.match = data;
            });

            if (userId === this.match?.stats.winner) {
                this.result = 'VICTORY';
                this.saucingObservers();
            } else this.result = 'DEFEAT';
            this.leaveMatch();
        } catch (err) {
            console.log('An error occurred while retrieving match info');
        }
    }

    private leaveMatch() {
        if (this.match?.matchId) this.fleeMatchEmitter.emit({ matchId: this.match.matchId });
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
}
