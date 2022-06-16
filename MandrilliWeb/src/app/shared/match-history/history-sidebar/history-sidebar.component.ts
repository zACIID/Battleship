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
    public matchHistory: MatchOverview[] = [];

    constructor(
        private matchClient: MatchApi,
        private userClient: UserApi,
        private userIdProvider: UserIdProvider    
    ) {}

    ngOnInit(): void {
        this.get10UserMatch();
    }

    public get10UserMatch(): void {
        try {
            let userId = this.userIdProvider.getUserId();
            let matches: Match[];
            this.userClient.getUserMatches(userId).subscribe((match: Match[]) => {
                matches = [...match];
                console.log(match)
                if (matches) {
                    this.matchHistory = matches.map((x) => {
                        let usr1: string = '';
                        this.userClient
                            .getUser(x.player1.playerId)
                            .subscribe((usr: User) => (usr1 = usr.username));

                        let usr2: string = '';
                        this.userClient
                            .getUser(x.player2.playerId)
                            .subscribe((usr: User) => (usr2 = usr.username));

                        return {
                            matchId: x.matchId,
                            player1Id: x.player1.playerId,
                            player2Id: x.player2.playerId,
                            username1: usr1,
                            username2: usr2,
                            winner: x.stats.winner,
                        };
                    });
                }
            });
        } catch (err) {
            console.log('Handling error: ' + err);
        }
    }
}
