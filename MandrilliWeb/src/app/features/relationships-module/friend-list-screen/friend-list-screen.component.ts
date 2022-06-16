import { FriendStatusChangedData } from 'src/app/core/model/events/friend-status-changed-data';
import { FriendStatusChangedListener } from 'src/app/core/events/listeners/friend-status-changed';
import { Relationship } from 'src/app/core/model/user/relationship';
import { UserApi } from './../../../core/api/handlers/user-api';
import { User } from 'src/app/core/model/user/user';
import { RelationshipOverview } from './../../../core/model/user/relationship-overview';
import { RelationshipApi } from './../../../core/api/handlers/relationship-api';
import { Component, OnInit } from '@angular/core';
import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';

@Component({
    selector: 'app-friend-list-screen',
    templateUrl: './friend-list-screen.component.html',
    styleUrls: ['./friend-list-screen.component.css'],
})
export class FriendListScreenComponent implements OnInit {
    public friends: RelationshipOverview[] = [];

    constructor(
        private relationshipsClient: RelationshipApi, 
        private userClient: UserApi, 
        private userIdProvider: UserIdProvider,
        private friendStatus: FriendStatusChangedListener
    ) {}

    ngOnInit(): void {
        try {
            let userId: string = this.userIdProvider.getUserId();
            this.relationshipsClient.getRelationships(userId).subscribe((data: Relationship[]) => {
                

                for(let rel of data){
                    const obj = {
                        friendId: rel.friendId,
                        chatId: rel.chatId,
                        friendUsername: "",
                        matchId: ""
                    }

                    this.userClient.getCurrentMatch(rel.friendId).subscribe({
                        next: (match: string) => {
                            obj.matchId = match;
                        },
                        error: (err: Error) => {}
                    })

                    this.userClient.getUser(rel.friendId).subscribe((user: User) => {
                        obj.friendUsername = user.username;
                        this.friends.push(obj);
                    })
                
                }
                
            });

            


        } catch (err) {
            console.log('An error occurred while retrieving the friends list: ' + err);
        }

        const newFriend = (newF: FriendStatusChangedData) => {
            this.ngOnInit();
        }
        newFriend.bind(this);
        this.friendStatus.listen(newFriend);

        
    }

}
