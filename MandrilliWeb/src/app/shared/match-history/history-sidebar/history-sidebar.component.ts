import { Component, OnInit } from '@angular/core';

import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';
import { User } from '../../../core/model/user/user';
import { MatchOverview } from '../../../core/model/match/match-overview';
import { UserApi } from '../../../core/api/handlers/user-api';
import { Match } from '../../../core/model/match/match';
import { Observable, merge } from 'rxjs';
import { KeyValue } from '@angular/common';

@Component({
    selector: 'history-sidebar',
    templateUrl: './history-sidebar.component.html',
    styleUrls: ['./history-sidebar.component.css'],
})
export class HistorySidebarComponent implements OnInit {
    public matchHistory?: MatchOverview[] = undefined;

    constructor(private userClient: UserApi, private userIdProvider: UserIdProvider) {}

    ngOnInit(): void {
        this.populateMatchHistory();
    }

    public populateMatchHistory(): void {
        let userId = this.userIdProvider.getUserId();

        // After having matched the 10 most recent matches of the user,
        // the match history is populated
        this.userClient.getUserMatches(userId, 0, 10).subscribe({
            next: (matches: Match[]) => {
                // Extract playerIds and keep only unique occurrences
                let playerIds: string[] = [];
                matches.forEach((m: Match) => {
                    const { player1, player2 } = m;
                    playerIds.push(player1.playerId, player2.playerId);
                });
                playerIds = Array.from(new Set(playerIds));

                // Get the observable for each user and then merge them.
                // The merged observable will be used to fetch the usernames of each player
                const playerFetchers: Observable<User>[] = playerIds.map((pId: string) => {
                    return this.userClient.getUser(pId);
                });
                const mergedFetcher: Observable<User> = merge(...playerFetchers);

                // Pair the usernames with their userId and use them, when all the players
                // are fetched, to create the match history
                const usernamesById: { [key: string]: string } = {};
                this.matchHistory = [];
                mergedFetcher.subscribe({
                    next: (player: User) => {
                        // Extract the player username
                        usernamesById[player.userId] = player.username;
                    },
                    complete: () => {
                        // After all the player usernames have been fetched,
                        // create the match history
                        matches.forEach((m: Match) => {
                            const { player1, player2 } = m;

                            // Match history is set to [] a couple lines above
                            this.matchHistory!.push({
                                matchId: m.matchId,
                                player1Id: player1.playerId,
                                player2Id: player2.playerId,
                                username1: usernamesById[player1.playerId],
                                username2: usernamesById[player2.playerId],
                                winner: m.stats.winner === null ? 'No Winner' : m.stats.winner,
                            });
                        });
                    },
                });
            },
            error: (err: Error) => {
                console.log('Error retrieving matches: ' + JSON.stringify(err));
            },
        });
    }
}
