import { MatchRequestAcceptedEmitter } from './../../../core/events/emitters/match-request-accepted';
import { UserApi } from './../../../core/api/handlers/user-api';
import { NotificationOverview } from './../../../core/model/user/notification-overview';
import { FriendRequestAcceptedEmitter } from './../../../core/events/emitters/friend-request-accepted';
import { NotificationApi } from './../../../core/api/handlers/notification-api';
import { Component, OnInit } from '@angular/core';
import { NotificationType } from '../../../core/model/user/notification';
import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';

@Component({
    selector: 'app-notification-screen',
    templateUrl: './notification-screen.component.html',
    styleUrls: ['./notification-screen.component.css'],
})
export class NotificationScreenComponent implements OnInit {
    public userId: string = '';
    public friendNotifications: NotificationOverview[] = [];
    public battleNotifications: NotificationOverview[] = [];

    // TODO resolve NullInjectorError on FriendRequestAcceptedEmitter
    constructor(
        private matchRequestAcceptedEmitter: MatchRequestAcceptedEmitter,
        private notificationApi: NotificationApi,
        private userApi: UserApi,
        private friendAcceptClient: FriendRequestAcceptedEmitter,
        private userIdProvider: UserIdProvider
    ) {}

    ngOnInit(): void {
        try {
            this.userId = this.userIdProvider.getUserId();
            this.notificationApi.getNotifications(this.userId).subscribe((data) => {
                for (let not of data) {
                    if (not.type === NotificationType.FriendRequest) {
                        this.userApi.getUser(not.sender).subscribe((usr) => {
                            usr.username; //TODO che serve?
                            this.friendNotifications.push({
                                type: not.type,
                                sender: not.sender,
                                senderUsername: usr.username,
                            });
                        });
                    } else {
                        this.userApi.getUser(not.sender).subscribe((usr) => {
                            usr.username; // TODO a cosa serve?
                            this.battleNotifications.push({
                                type: not.type,
                                sender: not.sender,
                                senderUsername: usr.username,
                            });
                        });
                    }
                }
            });
        } catch (err) {}
    }

    public acceptFriend(friendId: string) {
        this.friendAcceptClient.emit({
            receiverId: this.userId,
            senderId: friendId,
        });
    }

    public refuseFriend(friendId: string) {
        try {
            this.notificationApi.removeNotification(this.userId, {
                type: NotificationType.FriendRequest,
                sender: friendId,
            });
        } catch (err) {
            console.log('error removing friend notification: ' + err);
        }
    }

    public acceptBattle(friendId: string) {
        this.matchRequestAcceptedEmitter.emit({
            receiverId: this.userId,
            senderId: friendId,
        });
    }

    public refuseBattle(friendId: string) {
        try {
            this.notificationApi.removeNotification(this.userId, {
                type: NotificationType.MatchRequest,
                sender: friendId,
            });
        } catch (err) {
            console.log('error removing battle notification: ' + err);
        }
    }
}
