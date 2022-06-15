import { MatchRequestAcceptedEmitter } from './../../../core/events/emitters/match-request-accepted';
import { UserApi } from './../../../core/api/handlers/user-api';
import { NotificationOverview } from './../../../core/model/user/notification-overview';
import { FriendRequestAcceptedEmitter } from './../../../core/events/emitters/friend-request-accepted';
import { NotificationApi } from './../../../core/api/handlers/notification-api';
import { Component, OnInit } from '@angular/core';
import { NotificationType } from '../../../core/model/user/notification';
import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';
import { NotificationReceivedListener } from 'src/app/core/events/listeners/notification-received';
import { NotificationData } from 'src/app/core/model/events/notification-data';
import { NotificationDeletedListener } from 'src/app/core/events/listeners/notification-deleted';

@Component({
    selector: 'app-notification-screen',
    templateUrl: './notification-screen.component.html',
    styleUrls: ['./notification-screen.component.css'],
})
export class NotificationScreenComponent implements OnInit {
    public userId: string = '';
    public friendNotifications: NotificationOverview[] = [];
    public battleNotifications: NotificationOverview[] = [];

    constructor(
        private matchRequestAcceptedEmitter: MatchRequestAcceptedEmitter,
        private notificationApi: NotificationApi,
        private userApi: UserApi,
        private friendAcceptClient: FriendRequestAcceptedEmitter,
        private userIdProvider: UserIdProvider,
        private notificationListener: NotificationReceivedListener,
        private notificationDelListener: NotificationDeletedListener
    ) {}

    ngOnInit(): void {
        try {
            this.userId = this.userIdProvider.getUserId();
            this.notificationApi.getNotifications(this.userId).subscribe((data) => {
                for (let not of data) {
                    if (not.type === NotificationType.FriendRequest) {
                        this.userApi.getUser(not.sender).subscribe((usr) => {
                            this.friendNotifications.push({
                                type: not.type,
                                sender: not.sender,
                                senderUsername: usr.username,
                            });
                        });
                    } else {
                        this.userApi.getUser(not.sender).subscribe((usr) => {
                            this.battleNotifications.push({
                                type: not.type,
                                sender: not.sender,
                                senderUsername: usr.username,
                            });
                        });
                    }
                }
            });
        } catch (err) {
            console.log(err);
        }
        this.notificationListener.listen(this.pollingNotifications);
        this.notificationDelListener.listen(this.pollingDeletedNotifications);
    }

    ngOnDestroy() : void {
        this.notificationListener.unListen()
        this.notificationDelListener.unListen()
    }

    private pollingNotifications(notification: NotificationData) {
        this.userApi.getUser(notification.sender).subscribe((user) => {
            this.friendNotifications.push({
                type: notification.type,
                sender: notification.sender,
                senderUsername: user.username,
            });
        });
    }

    private pollingDeletedNotifications(notification: NotificationData) {
        this.friendNotifications = this.friendNotifications.filter((not) => {
            return notification.sender === not.sender && notification.type === not.type;
        });
    }

    public acceptFriend(friendId: string) {
        this.friendAcceptClient.emit({
            receiverId: friendId,
            senderId: this.userId,
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
