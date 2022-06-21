import { HtmlErrorMessage } from './../../../core/model/utils/htmlErrorMessage';
import { Relationship } from 'src/app/core/model/user/relationship';
import { Notification } from '../../../core/model/user/notification';
import { NotificationApi } from '../../../core/api/handlers/notification-api';
import { getRank } from '../../../core/model/user/elo-rankings';
import { Overview } from '../../../core/model/user/overview';
import { UserApi } from '../../../core/api/handlers/user-api';
import { RelationshipApi } from '../../../core/api/handlers/relationship-api';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserStatus } from '../../../core/model/user/user';
import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';
import { FriendStatusChangedListener } from 'src/app/core/events/listeners/friend-status-changed';
import { FriendStatusChangedData } from 'src/app/core/model/events/friend-status-changed-data';
import { NotificationType } from 'src/app/core/model/user/notification';

@Component({
    selector: 'app-play-together-screen',
    templateUrl: './play-together-screen.component.html',
    styleUrls: ['./play-together-screen.component.css'],
})
export class PlayTogetherScreenComponent implements OnInit, OnDestroy {
    public friends: Overview[] = [];
    private userInSessionId: string = '';
    public userMessage: HtmlErrorMessage = new HtmlErrorMessage();

    constructor(
        private relationshipClient: RelationshipApi,
        private userClient: UserApi,
        private userIdProvider: UserIdProvider,
        private friendListener: FriendStatusChangedListener,
        private notificationApi: NotificationApi
    ) {}

    ngOnInit(): void {
        try {
            // Retrieving only online friends
            this.userInSessionId = this.userIdProvider.getUserId();
            this.relationshipClient
                .getRelationships(this.userInSessionId)
                .subscribe((rels: Relationship[]) => {
                    for (let relation of rels) {
                        this.retrieveUserInfo(relation.friendId);
                    }
                });
        } catch (err) {
            console.log('An error occurred while retrieving online friends list: ' + err);
        }

        const pollingFriends = (data: FriendStatusChangedData) => {
            if(data.status === UserStatus.Online){
                this.friends = this.friends.filter((el: Overview) => { el.userId !== data.friendId })
                this.retrieveUserInfo(data.friendId);
            }
            else if(data.status === UserStatus.Offline){
                this.friends = this.friends.filter((el: Overview) => { el.userId !== data.friendId })
            }
            
        };
        pollingFriends.bind(this);
        this.friendListener.listen(pollingFriends);
    }


    private retrieveUserInfo(userId: string){
        this.userClient.getUser(userId).subscribe((friend) => {
            if (friend.status === UserStatus.Online) {
                this.friends.push({
                    userId: friend.userId,
                    username: friend.username,
                    elo: friend.elo,
                    rank: getRank(friend.elo),
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.friendListener.unListen();
    }

    public num_online() {
        return this.friends.length;
    }

    public askToBattle(friendId: string) {
        this.notificationApi
            .addNotification(friendId, {
                type: NotificationType.MatchRequest,
                sender: this.userInSessionId,
            })
            .subscribe({
                next: (not: Notification) => {
                    this.userMessage.error = true;
                    this.userMessage.errorMessage = "Notification sent!";
                },
                error: (err) => {
                    this.userMessage.error = true;
                    this.userMessage.errorMessage = "Notification already sent";
                }
            });
    }
}
