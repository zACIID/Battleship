import { User } from './../../../core/model/user/user';
import { UserApi } from './../../../core/api/handlers/user-api';
import { StatsOverview } from './../../../core/model/user/stats-overview';
import { Match } from './../../../core/model/match/match';
import { MatchApi } from './../../../core/api/handlers/match-api';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';

@Component({
    selector: 'match-result-screen',
    templateUrl: './match-result-screen.component.html',
    styleUrls: ['./match-result-screen.component.css'],
})
export class MatchResultScreenComponent implements OnInit {
    public matchShowedId: string = '';
    public match?: Match;
    public result?: string = undefined;
    public matchStats?: StatsOverview[] = undefined;

    constructor(
        private route: ActivatedRoute,
        private matchClient: MatchApi,
        private userIdProvider: UserIdProvider,
        private userClient: UserApi
    ) {}

    ngOnInit(): void {
        try {
            let userInSessionId = this.userIdProvider.getUserId();

            this.route.params.subscribe((params) => {
                this.matchShowedId = params['id'];

                this.matchClient.getMatch(this.matchShowedId).subscribe((data: Match) => {
                    this.match = data;
                    this.matchStats = [];
                    this.matchStats.push({
                        title: 'Ships Destroyed',
                        value: data.stats.shipsDestroyed,
                    });
                    this.matchStats.push({ title: 'Total Shots', value: data.stats.totalShots });
    
                    if (this.match.stats.endTime === null) {
                        throw new Error('End Time is null. Match probably did not end');
                    }
    
                    let duration = Math.abs(
                        this.match.stats.startTime.valueOf() - this.match.stats.endTime.valueOf()
                    );
                    let stringDuration = Math.floor(duration / 60).toString() + " minutes, " + (duration % 60).toString() +  " seconds"
                    this.matchStats.push({ title: 'Duration', value: stringDuration });
    
                    if (userInSessionId === this.match?.stats.winner) {
                        this.result = 'VICTORY';
                    } else this.result = 'DEFEAT';
                    if(this.match.player1.playerId !== userInSessionId && this.match.player2.playerId !== userInSessionId){
                        if(this.match.stats.winner){
                            this.userClient.getUser(this.match.stats.winner).subscribe((winner: User) => {
                                this.result = winner.username + " won !";
                            })
                        }
                    }
                });
            });

            
        } catch (err) {
            console.log('An error occurred while retrieving match info');
        }
    }
}
