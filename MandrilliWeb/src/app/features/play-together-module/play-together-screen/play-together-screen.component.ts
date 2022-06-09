import { getRank } from './../../../core/model/user/elo-rankings';
import { UserOverview } from './../../../core/model/user/user-overview';
import { UserApi } from './../../../core/api/handlers/user-api';
import { RelationshipApi } from './../../../core/api/handlers/relationship-api';
import { Component, OnInit } from '@angular/core';
import { UserStatus } from '../../../core/model/user/user';

@Component({
    selector: 'app-play-together-screen',
    templateUrl: './play-together-screen.component.html',
    styleUrls: ['./play-together-screen.component.css'],
})
export class PlayTogetherScreenComponent implements OnInit {
    public friends: UserOverview[] = [];

    constructor(
        private relationshipClient: RelationshipApi,
        private userClient: UserApi
    ) {}

    ngOnInit(): void {
        let userId: string = localStorage.getItem('id') || '';
        try {
            // Retrieving only online friends
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
    }

    public num_online() {
        return this.friends.length;
    }
}
