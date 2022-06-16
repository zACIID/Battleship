import { Relationship } from 'src/app/core/model/user/relationship';
import { Notification } from './../../../core/model/user/notification';
import { NotificationApi } from './../../../core/api/handlers/notification-api';
import { getRank } from './../../../core/model/user/elo-rankings';
import { Overview } from '../../../core/model/user/overview';
import { UserApi } from './../../../core/api/handlers/user-api';
import { RelationshipApi } from './../../../core/api/handlers/relationship-api';
import { Component, OnInit } from '@angular/core';
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
export class PlayTogetherScreenComponent implements OnInit {
    public friends: Overview[] = [];
    private userInSessionId: string = "";
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
            this.relationshipClient.getRelationships(this.userInSessionId).subscribe((rels: Relationship[]) => {
                for (let relation of rels) {
                    this.userClient.getUser(relation.friendId).subscribe((friend) => {
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
            });
        } catch (err) {
            console.log('An error occurred while retrieving online friends list: ' + err);
        }


        const pollingFriends = (data: FriendStatusChangedData) => {
            this.userClient.getUser(data.friendId).subscribe((user) => {
                this.friends.push({
                    userId: user.userId,
                    username: user.username,
                    elo: user.elo,
                    rank: getRank(user.elo),
                });
            });
        }
        pollingFriends.bind(this);
        this.friendListener.listen(pollingFriends);


    }

    ngOnDestroy() : void {
        this.friendListener.unListen()
    }

    public num_online() {
        return this.friends.length;
    }


    public askToBattle(friendId: string){

        this.notificationApi.addNotification(friendId, {sender: this.userInSessionId, type: NotificationType.MatchRequest})
        .subscribe((not: Notification) => {
            console.log("Correctly Added: " + JSON.stringify(not));
        })
    }

}
