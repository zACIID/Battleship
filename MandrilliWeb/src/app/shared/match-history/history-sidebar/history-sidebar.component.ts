import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';
import { User } from './../../../core/model/user/user';
import { MatchOverview } from './../../../core/model/match/match-overview';
import { UserApi } from './../../../core/api/handlers/user-api';
import { Component, OnInit } from '@angular/core';
import { Match } from '../../../core/model/match/match';
import { MatchApi } from '../../../core/api/handlers/match-api';

@Component({
    selector: 'history-sidebar',
    templateUrl: './history-sidebar.component.html',
    styleUrls: ['./history-sidebar.component.css'],
})
export class HistorySidebarComponent implements OnInit {
    public matchHistory?: MatchOverview[] = undefined;

    constructor(
        private userClient: UserApi,
        private userIdProvider: UserIdProvider
    ) {}

    ngOnInit(): void {
        this.get10UserMatch();
    }

    public get10UserMatch(): void {
        
        let userId = this.userIdProvider.getUserId();
        let matches: Match[] = [];
        this.userClient.getUserMatches(userId).subscribe({
            
            next: (match: Match[]) => {
                matches = [...match];
                
                this.matchHistory = [];
                for(let x of matches){
                    this.userClient
                    .getUser(x.player1.playerId)
                    .subscribe((usr1: User) => {
                        
                        this.userClient
                        .getUser(x.player2.playerId)
                        .subscribe((usr2: User) => {
                            if(this.matchHistory){
                                this.matchHistory.push({
                                    matchId: x.matchId,
                                    player1Id: x.player1.playerId,
                                    player2Id: x.player2.playerId,
                                    username1: usr1.username,
                                    username2: usr2.username,
                                    winner: x.stats.winner === null ? 'No Winner' : x.stats.winner,
                                })
                            }

                        });
                    
                    });

                }
                

            },
            error: (err: Error) => {
                console.log('Error retrieving matches: ' + JSON.stringify(err));
            },
        });
        
    }
}
