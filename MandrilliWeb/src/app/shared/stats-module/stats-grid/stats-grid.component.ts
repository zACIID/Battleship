import { MatchStats } from './../../../core/model/match/match-stats';
import { UserStats } from '../../../core/model/user/stats';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'stats-grid',
    templateUrl: './stats-grid.component.html',
    styleUrls: ['./stats-grid.component.css'],
})
export class StatsGridComponent implements OnInit {
    @Input() stats: UserStats = new UserStats();
    @Input() matchStats: MatchStats = new MatchStats();
    @Input() profile: boolean = false;
    public duration: number = 0;

    constructor() {}

    ngOnInit(): void {
        if (this.matchStats) {
            const diffTime = Math.abs(
                this.matchStats.startTime.valueOf() - this.matchStats.endTime.valueOf()
            );

            this.duration = diffTime;
        }
    }
}
