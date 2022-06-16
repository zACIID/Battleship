import { StatsOverview } from './../../../core/model/user/stats-overview';
import { UserApi } from './../../../core/api/handlers/user-api';
import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';
import { NotificationType } from './../../../core/model/user/notification';
import { NotificationApi } from './../../../core/api/handlers/notification-api';
import { UserStats } from '../../../core/model/user/stats';
import { User } from './../../../core/model/user/user';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'stats-overview',
    templateUrl: './stats-overview.component.html',
    styleUrls: ['./stats-overview.component.css'],
})
export class StatsOverviewComponent implements OnInit {
    
    
    @Input() user: User = new User();
    public stats: StatsOverview[] = [];
    @Input() myProfile: boolean = false;

    constructor(
        private notificationClient: NotificationApi,
        private userIdProvider: UserIdProvider,
        private userClient: UserApi
    ) {}

    ngOnInit(): void {
        this.getUserStats();
    }

    public addFriend() {
        let userInSessionId = this.userIdProvider.getUserId();

        try {
            this.notificationClient
                .addNotification(this.user.userId, {
                    type: NotificationType.FriendRequest,
                    sender: userInSessionId,
                })
                .subscribe((data) => {
                    console.log('Correctly added notification: ' + JSON.stringify(data));
                });
        } catch (err) {
            console.log('An error occurred in the process of adding a friend: ' + err);
        }
    }


    public getUserStats(): void {
        try {
            if (!this.user) throw new Error('User is not defined');
            this.userClient.getStats(this.user.userId).subscribe((stat: UserStats) => {
                this.stats.push({title: "Top Elo", value: stat.topElo});
                this.stats.push({title: "Total Wins", value: stat.wins});
                this.stats.push({title: "Total Losses", value: stat.losses});
                this.stats.push({title: "Ships Destroyed", value: stat.shipsDestroyed});
                this.stats.push({title: "Total Shots", value: stat.totalShots});
                this.stats.push({title: "Total Hits", value: stat.totalHits});
            });
        } catch (err) {
            console.log('An error occurred while retrieving user stats: ' + err);
        }
    }


}
