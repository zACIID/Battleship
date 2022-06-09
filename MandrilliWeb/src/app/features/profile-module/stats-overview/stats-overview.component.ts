import { NotificationApi } from './../../../core/api/handlers/notification-api';
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

    @Input() stats: UserStats = new UserStats();

    @Input() myProfile: boolean = false;

    constructor(private notificationClient: NotificationApi) {}

    ngOnInit(): void {}

    public addFriend() {
        let userInSessionId = localStorage.getItem('id') || '';

        try {
            this.notificationClient
                .addNotification(this.user.userId, {
                    type: 'FriendRequest',
                    sender: userInSessionId,
                })
                .subscribe((data) => {
                    console.log('Correctly added notification: ' + data);
                });
        } catch (err) {
            console.log('An error occurred in the process of adding a friend: ' + err);
        }
    }
}
