import { FriendStatusChangedData } from 'src/app/core/model/events/friend-status-changed-data';
import { FriendStatusChangedListener } from 'src/app/core/events/listeners/friend-status-changed';
import { Relationship } from 'src/app/core/model/user/relationship';
import { UserApi } from './../../../core/api/handlers/user-api';
import { User, UserStatus } from 'src/app/core/model/user/user';
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
            this.friends = [];
            let userId: string = this.userIdProvider.getUserId();
            this.relationshipsClient.getRelationships(userId).subscribe((data: Relationship[]) => {
                

                for(let rel of data){
                    const obj = {
                        friendId: rel.friendId,
                        chatId: rel.chatId,
                        friendUsername: "",
                        matchId: ""
                    }
                    
                    this.userClient.getUser(rel.friendId).subscribe((user: User) => {
                        obj.friendUsername = user.username;
                        
                        this.friends.push(obj);
                        if(user.status === UserStatus.InGame){
                            this.userClient.getCurrentMatch(rel.friendId).subscribe({
                                next: (match: string) => {
                                    obj.matchId = match;
                                },
                                error: (err: Error) => {}
                            })
                        }
                    })

                }
                
            });


        } catch (err) {
            console.log('An error occurred while retrieving the friends list: ' + err);
        }

        const newStatusFriend = (newF: FriendStatusChangedData) => {
            if(newF.status === UserStatus.Online){
                this.ngOnInit();
            }
            else{
                for(let friend of this.friends){
                    if(friend.friendId === newF.friendId){
                        if(newF.status === UserStatus.InGame){
                            this.userClient.getCurrentMatch(friend.friendId).subscribe({
                                next: (match: string) => {
                                    friend.matchId = match;
                                },
                                error: (err: Error) => {}
                            })
                        }
                    }
                }
            }
            
        }
        newStatusFriend.bind(this);
        this.friendStatus.listen(newStatusFriend);

    }

    ngOnDestroy(): void{
        this.friendStatus.unListen();       
    }

}
