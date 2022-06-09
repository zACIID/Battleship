import { LeaderboardEntry } from './../../../core/model/leaderboard/entry';
import { LeaderboardApi } from './../../../core/api/handlers/leaderboard-api';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-leaderboard-screen',
    templateUrl: './leaderboard-screen.component.html',
    styleUrls: ['./leaderboard-screen.component.css'],
})
export class LeaderboardScreenComponent implements OnInit {
    private options = {
        skip: 0,
        limit: 5,
    };

    public leaders: LeaderboardEntry[] = [];

    constructor(private leaderboardClient: LeaderboardApi) {}

    // TODO, what's NextPage in LeaderboardPage ??    - Guendaleena
    ngOnInit(): void {
        try {
            this.leaderboardClient
                .getLeaderboard(this.options.skip, this.options.limit)
                .subscribe((data) => {
                    this.leaders = data.leaderboard;
                });
        } catch (err) {
            console.log('An error occurred while retrieving the leaderboards');
        }
    }

    public num_leaders(): number {
        if (this.leaders) return this.leaders.length;
        else return 0;
    }

    public loadMore(): void {
        try {
            this.leaderboardClient
                .getLeaderboard(this.options.skip, this.options.limit)
                .subscribe((data) => {
                    this.leaders.push(...data.leaderboard);

                    this.options.skip += this.options.limit;
                });
        } catch (err) {
            console.log('An error while retrieving more leaders: ' + err);
        }
    }
}
