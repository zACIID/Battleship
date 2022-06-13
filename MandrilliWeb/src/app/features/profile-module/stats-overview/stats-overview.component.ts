import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';
import { NotificationType } from './../../../core/model/user/notification';
import { NotificationApi } from './../../../core/api/handlers/notification-api';
import { Stats } from '../../../core/model/user/stats';
import { User } from './../../../core/model/user/user';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'stats-overview',
    templateUrl: './stats-overview.component.html',
    styleUrls: ['./stats-overview.component.css'],
})
export class StatsOverviewComponent implements OnInit {
    @Input() user: User = new User();

    @Input() stats: Stats = new Stats();

    @Input() myProfile: boolean = false;

    constructor(
        private notificationClient: NotificationApi,
        private userIdProvider: UserIdProvider
    ) {}

    ngOnInit(): void {}

    public addFriend() {
        let userInSessionId = this.userIdProvider.getUserId();

        try {
            this.notificationClient
                .addNotification(this.user.userId, {
                    type: NotificationType.FriendRequest,
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
