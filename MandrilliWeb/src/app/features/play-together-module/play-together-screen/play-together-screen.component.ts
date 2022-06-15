import { getRank } from './../../../core/model/user/elo-rankings';
import { Overview } from '../../../core/model/user/overview';
import { UserApi } from './../../../core/api/handlers/user-api';
import { RelationshipApi } from './../../../core/api/handlers/relationship-api';
import { Component, OnInit } from '@angular/core';
import { UserStatus } from '../../../core/model/user/user';
import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';
import { FriendStatusChangedListener } from 'src/app/core/events/listeners/friend-status-changed';
import { FriendStatusChangedData } from 'src/app/core/model/events/friend-status-changed-data';

@Component({
    selector: 'app-play-together-screen',
    templateUrl: './play-together-screen.component.html',
    styleUrls: ['./play-together-screen.component.css'],
})
export class PlayTogetherScreenComponent implements OnInit {
    public friends: Overview[] = [];

    constructor(
        private relationshipClient: RelationshipApi,
        private userClient: UserApi,
        private userIdProvider: UserIdProvider,
        private friendListener: FriendStatusChangedListener
    ) {}

    ngOnInit(): void {
        try {
            // Retrieving only online friends
            let userId: string = this.userIdProvider.getUserId();
            this.relationshipClient.getRelationships(userId).subscribe((relationships) => {
                for (let relation of relationships) {
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
        this.friendListener.listen(this.pollingFriends);
    }

    ngOnDestroy() : void {
        this.friendListener.unListen()
    }

    public num_online() {
        return this.friends.length;
    }

    private pollingFriends(data: FriendStatusChangedData) {
        this.userClient.getUser(data.friendId).subscribe((user) => {
            this.friends.push({
                userId: user.userId,
                username: user.username,
                elo: user.elo,
                rank: getRank(user.elo),
            });
        });
    }
}
