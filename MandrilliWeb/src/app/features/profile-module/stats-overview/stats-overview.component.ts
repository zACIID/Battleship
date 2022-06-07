import { UserApi } from './../../../core/api/handlers/user-api';
import { UserStats } from './../../../core/model/user/user-stats';
import { User } from './../../../core/model/user/user';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'stats-overview',
    templateUrl: './stats-overview.component.html',
    styleUrls: ['./stats-overview.component.css'],
})
export class StatsOverviewComponent implements OnInit {

    @Input() user: User = new User();
    
    public stats: UserStats;

    constructor(private userClient: UserApi) {
        this.stats = new UserStats();
    }

    ngOnInit(): void {
        
        this.getUserStats();
    }


    public getUserStats() : void {
        try {

            if(!this.user) throw new Error("User is not defined");
            this.userClient.getStats(this.user.userId).subscribe((stat: UserStats) => {
                this.stats = stat;
            });
        } catch(err) {
            console.log("An error occurred while retrieving user stats: " + err);
        }
    }
}
