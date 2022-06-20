import { MatchRequestAcceptedEmitter } from '../../../core/events/emitters/match-request-accepted';
import { UserApi } from '../../../core/api/handlers/user-api';
import { NotificationOverview } from '../../../core/model/user/notification-overview';
import { FriendRequestAcceptedEmitter } from '../../../core/events/emitters/friend-request-accepted';
import { NotificationApi } from '../../../core/api/handlers/notification-api';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Notification, NotificationType } from '../../../core/model/user/notification';
import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';
import { NotificationReceivedListener } from 'src/app/core/events/listeners/notification-received';
import { NotificationData } from 'src/app/core/model/events/notification-data';
import { NotificationDeletedListener } from 'src/app/core/events/listeners/notification-deleted';
import { merge, Observable } from 'rxjs';
import { User } from '../../../core/model/user/user';

@Component({
    selector: 'app-notification-screen',
    templateUrl: './notification-screen.component.html',
    styleUrls: ['./notification-screen.component.css'],
})
export class NotificationScreenComponent implements OnInit, OnDestroy {
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
        this.populateNotificationsComponent();

        // Set up the notification listeners
        const pollingNotifications = (notification: NotificationData) => {
            this.userApi.getUser(notification.sender).subscribe((user) => {
                const newNotification: NotificationOverview = {
                    type: notification.type,
                    sender: notification.sender,
                    senderUsername: user.username,
                };

                if (notification.type === NotificationType.FriendRequest) {
                    this.friendNotifications.push(newNotification);
                } else if (notification.type === NotificationType.MatchRequest) {
                    this.battleNotifications.push(newNotification);
                } else {
                    throw new Error(`Unhandled notification type '${notification.type}'`);
                }
            });
        };
        pollingNotifications.bind(this);
        this.notificationListener.listen(pollingNotifications);

        const pollingDeletedNotifications = (notification: NotificationData) => {
            if (notification.type === NotificationType.FriendRequest) {
                this.friendNotifications = this.friendNotifications.filter(
                    (not: NotificationOverview) => {
                        return notification.sender === not.sender && notification.type === not.type;
                    }
                );
            } else {
                this.battleNotifications = this.battleNotifications.filter(
                    (not: NotificationOverview) => {
                        return notification.sender === not.sender && notification.type === not.type;
                    }
                );
            }
        };
        pollingDeletedNotifications.bind(this);
        this.notificationDelListener.listen(pollingDeletedNotifications);
    }

    /**
     * Fetches the notifications for the user and populates the component
     * @private
     */
    private populateNotificationsComponent() {
        try {
            this.userId = this.userIdProvider.getUserId();
            this.notificationApi
                .getNotifications(this.userId)
                .subscribe((notifications: Notification[]) => {
                    // Extract the unique sender ids. They will be later used to fetch
                    // the username of each sender
                    const senderIds: string[] = notifications.map((n: Notification) => {
                        return n.sender;
                    });
                    const uniqueSenderIds: string[] = Array.from(new Set(senderIds));

                    // Merge all the observable of the senders into one
                    const senderFetchers: Observable<User>[] = uniqueSenderIds.map(
                        (sId: string) => {
                            return this.userApi.getUser(sId);
                        }
                    );
                    const mergedFetchers: Observable<User> = merge(...senderFetchers);

                    // First fetch the username of each sender,
                    // then, on completion, populate the notification component
                    const usernamesById: { [id: string]: string } = {};
                    mergedFetchers.subscribe({
                        next: (sender: User) => {
                            usernamesById[sender.userId] = sender.username;
                        },
                        complete: () => {
                            notifications.forEach((n: Notification) => {
                                const notificationOverview: NotificationOverview = {
                                    type: n.type,
                                    sender: n.sender,
                                    senderUsername: usernamesById[n.sender],
                                };

                                if (n.type === NotificationType.FriendRequest) {
                                    this.friendNotifications.push(notificationOverview);
                                } else if (n.type === NotificationType.MatchRequest) {
                                    this.battleNotifications.push(notificationOverview);
                                } else {
                                    throw new Error(`Unhandled case of notification type.
                                    Unknown type: ${n.type}`);
                                }
                            });
                        },
                    });
                });
        } catch (err) {
            if (err instanceof Error) {
                console.log(`An error occurred while trying to populate the notification component.
                Reason: ${err.message}`);
            }
        }
    }

    ngOnDestroy(): void {
        this.notificationListener.unListen();
        this.notificationDelListener.unListen();
    }

    private dropNotification(no: NotificationData) {
        if (no.type === NotificationType.FriendRequest) {
            this.friendNotifications = this.friendNotifications.filter(
                (not: NotificationOverview) => {
                    return not.sender !== no.sender;
                }
            );
        } else {
            this.battleNotifications = this.battleNotifications.filter(
                (not: NotificationOverview) => {
                    return not.sender !== no.sender;
                }
            );
        }
    }

    public acceptFriend(friendId: string) {
        this.friendAcceptClient.emit({
            senderId: friendId,
            receiverId: this.userId,
        });
        this.dropNotification({ sender: friendId, type: NotificationType.FriendRequest });
    }

    public refuseFriend(friendId: string) {
        try {
            this.notificationApi
                .removeNotification(this.userId, {
                    type: NotificationType.FriendRequest,
                    sender: friendId,
                })
                .subscribe();
            this.dropNotification({ sender: friendId, type: NotificationType.FriendRequest });
        } catch (err) {
            console.log('error removing friend notification: ' + err);
        }
    }

    public acceptBattle(friendId: string) {
        this.matchRequestAcceptedEmitter.emit({
            receiverId: this.userId,
            senderId: friendId,
        });
        this.dropNotification({ sender: friendId, type: NotificationType.MatchRequest });
    }

    public refuseBattle(friendId: string) {
        this.notificationApi
            .removeNotification(this.userId, {
                type: NotificationType.MatchRequest,
                sender: friendId,
            })
            .subscribe();
        this.dropNotification({ sender: friendId, type: NotificationType.MatchRequest });
        console.log('dropped');
    }
}
