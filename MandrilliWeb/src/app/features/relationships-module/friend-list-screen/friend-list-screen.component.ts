import { Relationship } from 'src/app/core/model/user/relationship';
import { UserApi } from './../../../core/api/handlers/user-api';
import { User } from 'src/app/core/model/user/user';
import { RelationshipOverview } from './../../../core/model/user/relationship-overview';
import { RelationshipApi } from './../../../core/api/handlers/relationship-api';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-friend-list-screen',
    templateUrl: './friend-list-screen.component.html',
    styleUrls: ['./friend-list-screen.component.css'],
})
export class FriendListScreenComponent implements OnInit {
    public friends: RelationshipOverview[] = [];

    constructor(private relationshipsClient: RelationshipApi, private userClient: UserApi) {}

    ngOnInit(): void {
        let userId: string = localStorage.getItem('id') || '';

        try {
            this.relationshipsClient.getRelationships(userId).subscribe((data: Relationship[]) => {
                this.friends = data.map((rel: Relationship) => {
                    let usrnm: string = '';
                    this.userClient
                        .getUser(rel.friendId)
                        .subscribe((x: User) => (usrnm = x.username));

                    return {
                        friendId: rel.friendId,
                        chatId: rel.friendId,
                        friendUsername: usrnm,
                    };
                });
            });
        } catch (err) {
            console.log('An error occurred while retrieving the friends list: ' + err);
        }
    }
}
